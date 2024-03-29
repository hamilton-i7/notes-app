'use client';

import React, { useContext, useEffect, useState } from 'react';
import { NotesContext } from '../NotesContext';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Slide,
  Stack,
  Snackbar,
  Box,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close, MoreVert } from '@mui/icons-material';
import ElevationScrollAppBar from '@/app/components/ElevationScrollAppBar';
import BackgroundColorScrollToolbar from '@/app/components/BackgroundColorScrollToolbar';
import NoteContent from './components/NoteContent';
import NoteMenu from './components/NoteMenu';
import DeleteNoteDialog from './components/DeleteNoteDialog';
import { useGetNote, useUpdateNote } from '../notes.hook';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { useQueryClient } from '@tanstack/react-query';
import { NOTES_KEY } from '@/app/lib/constants';
import CategoriesDialog from '@/app/categories/components/CategoriesDialog';
import EmptyState from './components/EmptyState';
import NoteContentSkeleton from './components/NoteContentSkeleton';

const SNACKBAR_DURATION = 3_000;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PermanentContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        flexDirection: { lg: 'column' },
        flex: { lg: 2 },
        borderLeft: (theme) =>
          `${theme.spacing(0.25)} solid ${theme.palette.outline}`,
      }}
    >
      {children}
    </Box>
  );
}

export default function NotePage() {
  const { currentNoteId, setCurrentNoteId } = useContext(NotesContext);

  const queryClient = useQueryClient();

  const {
    data: note,
    isPending,
    isError,
    error,
  } = useGetNote(currentNoteId, !!currentNoteId);
  const { mutate: updateNote } = useUpdateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const [openDeleteNoteDialog, setOpenDeleteNoteDialog] = useState(false);
  const [openCategoriesDialog, setOpenCategoriesDialog] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [useSnackbarAction, setUseSnackbarAction] = useState(false);

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleClose = () => {
    setCurrentNoteId(null);
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptionsMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseDeleteNoteDialog = () => {
    setOpenDeleteNoteDialog(false);
  };

  const handleCloseCategoriesDialog = () => {
    setOpenCategoriesDialog(false);
  };

  const handleCloseSnakbar = () => {
    setShowSnackbar(false);
  };

  const handleUpdateNote = () => {
    const noteDto: UpdateNoteDto = {
      title,
      content,
    };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: note!.archivedAt
              ? [NOTES_KEY, { archived: true }]
              : [NOTES_KEY],
          });
          setSnackbarMessage('Note updated 😊');
          setUseSnackbarAction(false);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleArchiveToggle = () => {
    handleCloseOptionsMenu();

    const archivedAt = note!.archivedAt
      ? null
      : new Date(Date.now()).toISOString();
    const noteDto: UpdateNoteDto = { archivedAt };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [NOTES_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [NOTES_KEY, { archived: true }],
          });
          setSnackbarMessage(
            archivedAt ? 'Note archived 😟' : 'Note restored 😃'
          );
          setUseSnackbarAction(true);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleCategoriesClick = () => {
    handleCloseOptionsMenu();
    setOpenCategoriesDialog(true);
  };

  const handleDeleteClick = () => {
    handleCloseOptionsMenu();
    setOpenDeleteNoteDialog(true);
  };

  const handleUndoArchiveToggle = () => {
    handleCloseSnakbar();

    const archivedAt = note!.archivedAt
      ? null
      : new Date(Date.now()).toISOString();
    const noteDto: UpdateNoteDto = { archivedAt };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [NOTES_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [NOTES_KEY, { archived: true }],
          });
        },
      }
    );
  };

  const topBar = (
    <ElevationScrollAppBar>
      <AppBar
        sx={{
          position: 'relative',
          color: (theme) => theme.palette.background.onSurface,
        }}
      >
        <BackgroundColorScrollToolbar sx={{ justifyContent: 'space-between' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ mx: (theme) => theme.spacing(2) }}
            >
              <Close />
            </IconButton>
            <Stack direction="row" alignItems="center">
              <Button
                variant="text"
                onClick={handleUpdateNote}
                sx={{ typography: 'body-l', textTransform: 'capitalize' }}
              >
                Save
              </Button>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleOptionsClick}
                aria-label="close"
                sx={{ mx: (theme) => theme.spacing(2) }}
              >
                <MoreVert />
              </IconButton>
              <NoteMenu
                anchorEl={anchorEl}
                isArchived={Boolean(note?.archivedAt)}
                open={openOptionsMenu}
                onClose={handleCloseOptionsMenu}
                onArchiveToggleClick={handleArchiveToggle}
                onDeleteClick={handleDeleteClick}
                onCategoriesClick={handleCategoriesClick}
              />
            </Stack>
          </Toolbar>
        </BackgroundColorScrollToolbar>
      </AppBar>
    </ElevationScrollAppBar>
  );

  const snackbarAction = (
    <Button size="small" onClick={handleUndoArchiveToggle}>
      Undo
    </Button>
  );

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  if (!currentNoteId) {
    return <EmptyState />;
  }

  if (isPending) {
    return (
      <PermanentContentWrapper>
        {topBar}
        <NoteContentSkeleton />
      </PermanentContentWrapper>
    );
  }

  if (isError) {
    return <div>Error {error.message}</div>;
  }

  const pageContent = (
    <NoteContent
      title={title}
      onTitleChange={handleTitleChange}
      content={content}
      onContentChange={handleContentChange}
      dateCreated={note.createdAt}
      lastModified={note.lastModified}
      categories={note.categories}
    />
  );

  return (
    <>
      <Dialog
        fullScreen
        open
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiPaper-root': {
            bgcolor: (theme) => theme.palette.background.surface,
          },
        }}
      >
        {topBar}
        {pageContent}
      </Dialog>

      <PermanentContentWrapper>
        {topBar}
        {pageContent}
      </PermanentContentWrapper>

      <CategoriesDialog
        open={openCategoriesDialog}
        onClose={handleCloseCategoriesDialog}
      />
      <DeleteNoteDialog
        open={openDeleteNoteDialog}
        onClose={handleCloseDeleteNoteDialog}
      />
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={SNACKBAR_DURATION}
        onClose={handleCloseSnakbar}
        message={snackbarMessage}
        action={useSnackbarAction ? snackbarAction : null}
      />
    </>
  );
}
