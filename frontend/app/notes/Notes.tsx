'use client';

import React, { useContext, useEffect, useState } from 'react';
import {
  useGetNotes,
  useGetNotesByCategories,
  useReorderNotes,
} from './notes.hook';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import NoteCard, { SortableNoteCard } from './components/NoteCard';
import { NotesContext } from './NotesContext';
import { Add, MoreVert } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Sunlight from '../../public/sunlight.svg';
import NoteCardSkeleton from './components/NoteCardSkeleton';
import BackgroundColorScrollToolbar from '../components/BackgroundColorScrollToolbar';
import ElevationScrollAppBar from '../components/ElevationScrollAppBar';
import CategoryMenu from '../categories/components/CategoryMenu';
import DeleteCategoryDialog from '../categories/components/DeleteCategoryDialog';
import EditCategoryDialog from '../categories/components/EditCategoryDialog';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Note } from './models/note.model';
import { NOTE_TYPE } from '../lib/constants';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

export default function Notes() {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.getAll('categories');

  const {
    data: notesData,
    isPending,
    isError,
    error,
  } = useGetNotes(categoryParams.length === 0);
  const { mutate: reorderNotes } = useReorderNotes();

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type !== NOTE_TYPE) return;
    setActiveNote(active.data.current.note);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNote(null);

    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;
    if (
      active.data.current?.type !== NOTE_TYPE &&
      over.data.current?.type !== NOTE_TYPE
    )
      return;

    const activeNoteIndex = notes.findIndex(
      ({ id }) => id.toString() === active.id
    );
    const overColumnIndex = notes.findIndex(
      ({ id }) => id.toString() === over.id
    );
    const updatedNotes = arrayMove(notes, activeNoteIndex, overColumnIndex);

    setNotes(updatedNotes);
    reorderNotes({ notes: updatedNotes.map(({ id }) => id) });
  };

  const handleDragCancel = () => {
    setActiveNote(null);
  };

  useEffect(() => {
    if (!notesData) return;
    setNotes(notesData);
  }, [notesData]);

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <NotesContent
        data={notes}
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
      />
      {typeof window === 'object' &&
        createPortal(
          <DragOverlay>
            {activeNote ? <NoteCard note={activeNote} /> : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const { setDisplayAddNote, setCurrentNoteId } = useContext(NotesContext);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState(false);

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptionsMenu = () => {
    setAnchorEl(null);
  };

  const handleEditCategoryClick = () => {
    handleCloseOptionsMenu();
    setShowEditCategoryDialog(true);
  };

  const handleEditCategoryClose = () => {
    setShowEditCategoryDialog(false);
  };

  const handleDeleteCategoryClick = () => {
    handleCloseOptionsMenu();
    setShowDeleteCategoryDialog(true);
  };

  const handleDeleteCategoryClose = () => {
    setShowDeleteCategoryDialog(false);
  };

  const handleCreateNoteClick = () => {
    setDisplayAddNote(true);
    setCurrentNoteId(null);
  };

  return (
    <>
      <Stack
        component="main"
        sx={{
          bgcolor: (theme) => theme.palette.background.main,
          flex: { lg: 1 },
          overflowY: { lg: 'scroll' },
          width: { xs: '100%', lg: 'auto' },
        }}
      >
        {searchParams.has('categories') && (
          <ElevationScrollAppBar>
            <AppBar
              sx={{
                position: 'relative',
                color: (theme) => theme.palette.background.onSurface,
              }}
            >
              <BackgroundColorScrollToolbar
                sx={{ '&.MuiToolbar-root': { justifyContent: 'end' } }}
              >
                <Toolbar>
                  <IconButton
                    color="inherit"
                    onClick={handleOptionsClick}
                    aria-label="close"
                    sx={{ mx: (theme) => theme.spacing(2) }}
                  >
                    <MoreVert />
                  </IconButton>
                  <CategoryMenu
                    anchorEl={anchorEl}
                    open={openOptionsMenu}
                    onClose={handleCloseOptionsMenu}
                    onEditClick={handleEditCategoryClick}
                    onDeleteClick={handleDeleteCategoryClick}
                  />
                </Toolbar>
              </BackgroundColorScrollToolbar>
            </AppBar>
          </ElevationScrollAppBar>
        )}
        <Box sx={{ p: (theme) => theme.spacing(4) }}>
          <Button
            variant="text"
            startIcon={<Add />}
            onClick={handleCreateNoteClick}
            sx={{
              alignSelf: 'start',
              mb: (theme) => theme.spacing(4),
              typography: 'body-l',
              textTransform: 'capitalize',
            }}
          >
            Create note
          </Button>
          <Stack spacing={4}>{children}</Stack>
        </Box>
      </Stack>
      <EditCategoryDialog
        id={+searchParams.get('categories')!}
        open={showEditCategoryDialog}
        onClose={handleEditCategoryClose}
      />
      <DeleteCategoryDialog
        id={+searchParams.get('categories')!}
        open={showDeleteCategoryDialog}
        onClose={handleDeleteCategoryClose}
      />
    </>
  );
}

type NotesContentProps = {
  data: Note[];
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
};

function NotesContent({
  data: notes,
  isPending,
  isError,
  errorMessage,
}: NotesContentProps) {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.getAll('categories');

  const {
    data: filteredNotes,
    isPending: isFilterPending,
    isError: isFilterError,
    error: filterError,
  } = useGetNotesByCategories(
    categoryParams.map((categoryId) => +categoryId),
    categoryParams.length > 0
  );
  const { setCurrentNoteId } = useContext(NotesContext);

  if (searchParams.has('categories')) {
    if (isFilterPending) {
      return (
        <ContentWrapper>
          {Array.from(Array(3)).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </ContentWrapper>
      );
    }

    if (isFilterError) {
      return <main>Error: {filterError.message}</main>;
    }

    const isEmpty =
      filteredNotes.active.length === 0 && filteredNotes.archived.length === 0;

    return (
      <ContentWrapper>
        {isEmpty && <EmptyState />}
        {filteredNotes.active.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
        ))}
        {filteredNotes.archived.length > 0 && (
          <>
            <Typography
              variant="body-m"
              sx={{
                color: (theme) => theme.palette.outline,
                m: (theme) => theme.spacing(4, 6, 0),
              }}
            >
              Archived
            </Typography>
            {filteredNotes.archived.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onNoteClick={setCurrentNoteId}
              />
            ))}
          </>
        )}
      </ContentWrapper>
    );
  }

  if (isPending) {
    return (
      <ContentWrapper>
        {Array.from(Array(3)).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </ContentWrapper>
    );
  }

  if (isError) {
    return <main>Error: {errorMessage}</main>;
  }

  return (
    <ContentWrapper>
      {notes.length > 0 ? (
        <SortableContext
          items={notes.map(({ id }) => id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {notes.map((note) => (
            <SortableNoteCard
              key={note.id}
              note={note}
              onNoteClick={setCurrentNoteId}
            />
          ))}
        </SortableContext>
      ) : (
        <EmptyState />
      )}
    </ContentWrapper>
  );
}

function EmptyState() {
  return (
    <Box sx={{ alignSelf: 'center', pt: (theme) => theme.spacing(8) }}>
      <Image
        src={Sunlight}
        alt="Womant staring at the sun"
        width={200}
        priority
      />
    </Box>
  );
}
