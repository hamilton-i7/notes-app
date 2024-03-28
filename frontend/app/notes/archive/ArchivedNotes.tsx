'use client';

import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import { useGetArchivedNotes } from '../notes.hook';
import NoteCard from '../components/NoteCard';
import { NotesContext } from '../NotesContext';
import NoteCardSkeleton from '../components/NoteCardSkeleton';

function ContentWrapper({ children }: { children: React.ReactNode }) {
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
      <Stack spacing={4}>{children}</Stack>
    </Stack>
  );
}

export default function ArchivedNotes() {
  const { data: notes, isPending, isError, error } = useGetArchivedNotes();
  const { setCurrentNoteId } = useContext(NotesContext);

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
    return <main>Error: {error.message}</main>;
  }
  return (
    <ContentWrapper>
      <Stack spacing={4}>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
        ))}
      </Stack>
    </ContentWrapper>
  );
}
