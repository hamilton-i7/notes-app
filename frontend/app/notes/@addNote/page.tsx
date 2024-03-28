'use client';

import BackgroundColorScrollToolbar from '@/app/components/BackgroundColorScrollToolbar';
import ElevationScrollAppBar from '@/app/components/ElevationScrollAppBar';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Button,
} from '@mui/material';
import { title } from 'process';
import React, { useContext, useState } from 'react';
import NoteContent from '../@note/components/NoteContent';
import { NotesContext } from '../NotesContext';
import { TransitionProps } from '@mui/material/transitions';
import { useCreateNote } from '../notes.hook';
import { CreateNoteDto } from '../dto/create-note.dto';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddNotePage() {
  const { mutate: createNote } = useCreateNote();
  const { displayAddNote, setDisplayAddNote, setCurrentNote } =
    useContext(NotesContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleClose = () => {
    setDisplayAddNote(false);
  };

  const handleAddNote = () => {
    const note: CreateNoteDto = {
      title,
      content,
      archivedAt: null,
      categories: [],
    };

    createNote(note, {
      onSuccess: (data) => {
        setDisplayAddNote(false);
        setCurrentNote(data);
      },
    });
  };

  if (!displayAddNote) return null;

  return (
    <Dialog
      fullScreen
      open
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
              <Button
                variant="text"
                sx={{ typography: 'body-l', textTransform: 'capitalize' }}
                onClick={handleAddNote}
              >
                Save
              </Button>
            </Toolbar>
          </BackgroundColorScrollToolbar>
        </AppBar>
      </ElevationScrollAppBar>
      <NoteContent
        title={title}
        onTitleChange={handleTitleChange}
        content={content}
        onContentChange={handleContentChange}
      />
    </Dialog>
  );
}
