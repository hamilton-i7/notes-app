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
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close, MoreVert } from '@mui/icons-material';
import ElevationScrollAppBar from '@/app/components/ElevationScrollAppBar';
import BackgroundColorScrollToolbar from '@/app/components/BackgroundColorScrollToolbar';
import NoteContent from './components/NoteContent';
import NoteMenu from './components/NoteMenu';
import DeleteNoteDialog from './components/DeleteNoteDialog';
import { useUpdateNote } from '../notes.hook';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { useQueryClient } from '@tanstack/react-query';
import { ARCHIVED_NOTES_KEY, NOTES_KEY } from '@/app/lib/constants';

const SNACKBAR_DURATION = 3_000;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotePage() {
  const { currentNote, setCurrentNote } = useContext(NotesContext);
  const { mutate: updateNote } = useUpdateNote();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const [openDeleteNoteDialog, setOpenDeleteNoteDialog] = useState(false);
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
    setCurrentNote(null);
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

  const handleCloseSnakbar = () => {
    setShowSnackbar(false);
  };

  const handleUpdateNote = () => {
    const note: UpdateNoteDto = {
      title,
      content,
    };

    updateNote(
      { id: currentNote!.id, note },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: currentNote!.archivedAt
              ? [ARCHIVED_NOTES_KEY]
              : [NOTES_KEY],
          });
          setCurrentNote(data);
          setSnackbarMessage('Note updated 😊');
          setUseSnackbarAction(false);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleArchiveToggle = () => {
    handleCloseOptionsMenu();

    const archivedAt = currentNote!.archivedAt
      ? null
      : new Date(Date.now()).toISOString();
    const note: UpdateNoteDto = { archivedAt };

    updateNote(
      { id: currentNote!.id, note },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: [NOTES_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [ARCHIVED_NOTES_KEY],
          });
          setCurrentNote(data);
          setSnackbarMessage(
            archivedAt ? 'Note archived 😟' : 'Note restored 😃'
          );
          setUseSnackbarAction(true);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleDeleteClick = () => {
    handleCloseOptionsMenu();
    setOpenDeleteNoteDialog(true);
  };

  const handleUndoArchiveToggle = () => {
    handleCloseSnakbar();

    const archivedAt = currentNote!.archivedAt
      ? null
      : new Date(Date.now()).toISOString();
    const note: UpdateNoteDto = { archivedAt };

    updateNote(
      { id: currentNote!.id, note },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: [NOTES_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [ARCHIVED_NOTES_KEY],
          });
          setCurrentNote(data);
        },
      }
    );
  };

  const snackbarAction = (
    <Button size="small" onClick={handleUndoArchiveToggle}>
      Undo
    </Button>
  );

  useEffect(() => {
    if (!currentNote) return;
    setTitle(currentNote.title);
    setContent(currentNote.content);
  }, [currentNote]);

  if (!currentNote) return null;

  return (
    <>
      <Dialog
        fullScreen
        open={Boolean(currentNote)}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: (theme) => theme.palette.background.surface,
          },
        }}
      >
        <ElevationScrollAppBar>
          <AppBar
            sx={{
              position: 'relative',
              color: (theme) => theme.palette.background.onSurface,
            }}
          >
            <BackgroundColorScrollToolbar
              sx={{ justifyContent: 'space-between' }}
            >
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
                    isArchived={Boolean(currentNote.archivedAt)}
                    open={openOptionsMenu}
                    onClose={handleCloseOptionsMenu}
                    onArchiveToggleClick={handleArchiveToggle}
                    onDeleteClick={handleDeleteClick}
                  />
                </Stack>
              </Toolbar>
            </BackgroundColorScrollToolbar>
          </AppBar>
        </ElevationScrollAppBar>
        <NoteContent
          title={title}
          onTitleChange={handleTitleChange}
          content={content}
          onContentChange={handleContentChange}
          dateCreated={currentNote.createdAt}
          lastModified={currentNote.lastModified}
        />
      </Dialog>
      <DeleteNoteDialog
        open={openDeleteNoteDialog}
        onClose={handleCloseDeleteNoteDialog}
      />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={SNACKBAR_DURATION}
        onClose={handleCloseSnakbar}
        message={snackbarMessage}
        action={useSnackbarAction ? snackbarAction : null}
      />
    </>
  );
}
