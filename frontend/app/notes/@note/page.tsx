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
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close, MoreVert } from '@mui/icons-material';
import ElevationScrollAppBar from '@/app/components/ElevationScrollAppBar';
import BackgroundColorScrollToolbar from '@/app/components/BackgroundColorScrollToolbar';
import NoteContent from './components/NoteContent';

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

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleClose = () => {
    setCurrentNote(null);
  };

  const handleOptionsClick = () => {};

  useEffect(() => {
    if (!currentNote) return;
    setTitle(currentNote.title);
    setContent(currentNote.content);
  }, [currentNote]);

  if (!currentNote) return null;

  return (
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
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleOptionsClick}
                aria-label="close"
                sx={{ mx: (theme) => theme.spacing(2) }}
              >
                <MoreVert />
              </IconButton>
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
  );
}
