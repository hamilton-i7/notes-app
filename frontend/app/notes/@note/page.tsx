'use client';

import React, { useContext, useEffect, useState } from 'react';
import { NotesContext } from '../NotesContext';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Slide,
  Stack,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close, MoreVert } from '@mui/icons-material';
import ElevationScrollAppBar from '@/app/components/ElevationScrollAppBar';
import BackgroundColorScrollToolbar from '@/app/components/BackgroundColorScrollToolbar';
import NoteContent from './components/NoteContent';
import NoteMenu from './components/NoteMenu';
import DeleteNoteDialog from './components/DeleteNoteDialog';

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

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const [openDeleteNoteDialog, setOpenDeleteNoteDialog] = useState(false);

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

  const handleArchiveToggle = () => {
    handleCloseOptionsMenu();
    console.log('TOGGLE ARCHIVE STATE');
  };

  const handleDeleteClick = () => {
    handleCloseOptionsMenu();
    setOpenDeleteNoteDialog(true);
  };

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
    </>
  );
}
