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
  useMediaQuery,
  useTheme,
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
  const categoryId = searchParams.get('categories');
  const isCategoryScreen = searchParams.has('categories');

  const { setDisplayAddNote, setCurrentNoteId } = useContext(NotesContext);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState(false);

  const {
    data: notesData,
    isPending,
    isError,
    error,
  } = useGetNotes(!isCategoryScreen);
  const {
    data: categoryNotes,
    isSuccess: isCategoryNotesSuccess,
    isPending: isCategoryNotesPending,
    isError: isCategoryNotesError,
    error: categoryNotesError,
  } = useGetNotesByCategories(categoryId ? +categoryId : 0, isCategoryScreen);
  const { mutate: reorderNotes } = useReorderNotes();

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

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

  const isEmpty =
    categoryNotes?.active.length === 0 && categoryNotes.archived.length === 0;

  useEffect(() => {
    if (!notesData) return;
    setNotes(notesData);
  }, [notesData]);

  useEffect(() => {
    if (!categoryNotes) return;
    if (isEmpty) return;
    if (!categoryId) return;

    const categories = [
      ...categoryNotes.active,
      ...categoryNotes.archived,
    ].flatMap((note) => note.categories);
    setCategoryName(
      categories.find(({ id }) => id === +categoryId)?.name ?? ''
    );
  }, [categoryNotes, isEmpty, categoryId]);

  const categoriesContent = (
    <>
      {isCategoryNotesPending &&
        Array.from(Array(3)).map((_, i) => <NoteCardSkeleton key={i} />)}
      {isCategoryNotesError && <main>Error: {categoryNotesError.message}</main>}
      {isEmpty && <EmptyState />}
      {isCategoryNotesSuccess &&
        categoryNotes.active.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
        ))}
      {isCategoryNotesSuccess && categoryNotes.archived.length > 0 && (
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
          {categoryNotes.archived.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onNoteClick={setCurrentNoteId}
            />
          ))}
        </>
      )}
    </>
  );

  const content = (
    <>
      {isPending &&
        Array.from(Array(3)).map((_, i) => <NoteCardSkeleton key={i} />)}
      {isError && <main>Error: {error.message}</main>}
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
    </>
  );

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Stack
        component="main"
        sx={{
          bgcolor: (theme) => theme.palette.background.main,
          overflowY: { lg: 'scroll' },
          width: (theme) => ({ xs: '100%', lg: theme.spacing(100) }),
        }}
      >
        {isCategoryScreen && matches && (
          <ElevationScrollAppBar>
            <AppBar
              sx={{
                position: 'relative',
                color: (theme) => theme.palette.background.onSurface,
              }}
            >
              <BackgroundColorScrollToolbar>
                <Toolbar>
                  <Typography
                    variant="heading-l"
                    noWrap
                    component="h1"
                    color="inherit"
                    sx={{ flex: 1 }}
                  >
                    {categoryName}
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={handleOptionsClick}
                    aria-label="open category options menu"
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
          <Stack spacing={4}>
            {isCategoryScreen ? categoriesContent : content}
          </Stack>
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
