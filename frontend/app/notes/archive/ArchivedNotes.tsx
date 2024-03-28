'use client';

import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import { useGetArchivedNotes } from '../notes.hook';
import NoteCard from '../components/NoteCard';
import { NotesContext } from '../NotesContext';

export default function ArchivedNotes() {
  const { data: notes, isPending, isError, error } = useGetArchivedNotes();
  const { setCurrentNoteId } = useContext(NotesContext);

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
        flex: { lg: 1 },
        overflowY: { lg: 'scroll' },
      }}
    >
      <Stack spacing={4}>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
        ))}
      </Stack>
    </Stack>
  );
}
