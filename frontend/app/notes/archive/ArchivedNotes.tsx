'use client';

import React, { useContext } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useGetArchivedNotes } from '../notes.hook';
import NoteCard from '../components/NoteCard';
import { NotesContext } from '../NotesContext';

export default function ArchivedNotes() {
  const { data: notes, isPending, isError, error } = useGetArchivedNotes();
  const { setCurrentNote } = useContext(NotesContext);

  if (isPending) {
    return <main>Loading...</main>;
  }

  if (isError) {
    return <main>Error: {error.message}</main>;
  }
  return (
    <Stack
      component="main"
      sx={{
        p: (theme) => theme.spacing(4),
        bgcolor: (theme) => theme.palette.background.main,
      }}
    >
      <Grid container spacing={4}>
        {notes.map((note) => (
          <Grid key={note.id} item xs={12}>
            <NoteCard note={note} onNoteClick={setCurrentNote} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
