'use client';

import React, { useContext } from 'react';
import { Stack, Typography } from '@mui/material';
import { useGetArchivedNotes } from '../notes.hook';
import NoteCard from '../components/NoteCard';
import { NotesContext } from '../NotesContext';
import NoteCardSkeleton from '../components/NoteCardSkeleton';
import { Archive } from '@mui/icons-material';

export default function ArchivedNotes() {
  const { data: notes, isPending, isError, error } = useGetArchivedNotes();
  const { setCurrentNoteId } = useContext(NotesContext);

  if (isPending) {
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
          {Array.from(Array(3)).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </Stack>
      </Stack>
    );
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
        flex: (theme) => ({ lg: `1 ${theme.spacing(20)}` }),
        overflowY: { lg: 'scroll' },
        justifyContent: notes.length === 0 ? 'center' : 'flex-start',
      }}
    >
      <Stack spacing={4}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onNoteClick={setCurrentNoteId}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </Stack>
    </Stack>
  );
}

function EmptyState() {
  return (
    <Stack
      alignItems="center"
      spacing={4}
      sx={{
        pt: (theme) => theme.spacing(8),
      }}
    >
      <Archive sx={{ fontSize: (theme) => theme.spacing(20) }} />
      <Typography
        variant="body-l"
        sx={{
          textAlign: 'center',
          color: (theme) => theme.palette.outline,
        }}
      >
        Your active notes are keeping you company! No archived notes found. Keep
        adding and organizing your thoughts!
      </Typography>
    </Stack>
  );
}
