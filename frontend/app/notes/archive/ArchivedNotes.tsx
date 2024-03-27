'use client';

import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useGetArchivedNotes } from '../notes.hook';
import NoteCard from '../components/NoteCard';

export default function ArchivedNotes() {
  const { data: notes, isPending, isError, error } = useGetArchivedNotes();

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
            <NoteCard note={note} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
