'use client';

import React, { useContext } from 'react';
import { useGetFavoriteNotes } from '../notes.hook';
import { NotesContext } from '../NotesContext';
import { FavoriteBorderOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import NoteCard from '../components/NoteCard';
import NoteCardSkeleton from '../components/NoteCardSkeleton';

export default function FavoriteNotes() {
  const { data: notes, isPending, isError, error } = useGetFavoriteNotes();
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

  const isEmpty = notes?.active.length === 0 && notes.archived.length === 0;

  return (
    <Stack
      component="main"
      sx={{
        p: (theme) => theme.spacing(4),
        bgcolor: (theme) => theme.palette.background.main,
        overflowY: { lg: 'scroll' },
        justifyContent: isEmpty ? 'center' : 'flex-start',
        width: (theme) => ({ xs: '100%', lg: theme.spacing(100) }),
      }}
    >
      <Stack spacing={4}>
        {isEmpty && <EmptyState />}
        {notes.active.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
        ))}
        {notes.archived.length > 0 && (
          <>
            <Typography
              variant="body-m"
              sx={{
                color: (theme) => theme.palette.outline,
                m: (theme) => theme.spacing(4, 6, 0),
              }}
            >
              Archived
            </Typography>
            {notes.archived.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onNoteClick={setCurrentNoteId}
              />
            ))}
          </>
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
      <FavoriteBorderOutlined sx={{ fontSize: (theme) => theme.spacing(20) }} />
      <Typography
        variant="body-l"
        sx={{
          textAlign: 'center',
          color: (theme) => theme.palette.outline,
        }}
      >
        Don&apos;t let great notes get lost. Star them to keep them readily
        accessible.
      </Typography>
    </Stack>
  );
}
