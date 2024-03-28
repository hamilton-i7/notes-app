'use client';

import React, { useContext } from 'react';
import { useGetNotes, useGetNotesByCategories } from './notes.hook';
import { Button, Grid, Stack, Typography } from '@mui/material';
import NoteCard from './components/NoteCard';
import { NotesContext } from './NotesContext';
import { Add } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { setDisplayAddNote } = useContext(NotesContext);

  const handleCreateNoteClick = () => {
    setDisplayAddNote(true);
  };

  return (
    <Stack
      component="main"
      sx={{
        p: (theme) => theme.spacing(4),
        bgcolor: (theme) => theme.palette.background.main,
      }}
    >
      <Button
        variant="text"
        startIcon={<Add />}
        onClick={handleCreateNoteClick}
        sx={{
          alignSelf: 'start',
          mb: (theme) => theme.spacing(4),
          typography: 'body-l',
          textTransform: 'capitalize',
        }}
      >
        Create note
      </Button>
      <Stack spacing={4}>{children}</Stack>
    </Stack>
  );
}

export default function Notes() {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.getAll('categories');

  const {
    data: notes,
    isPending,
    isError,
    error,
  } = useGetNotes(categoryParams.length === 0);
  const {
    data: filteredNotes,
    isPending: isFilterPending,
    isError: isFilterError,
    error: filterError,
  } = useGetNotesByCategories(
    categoryParams.map((categoryId) => +categoryId),
    categoryParams.length > 0
  );
  const { setCurrentNoteId } = useContext(NotesContext);

  if (searchParams.has('categories')) {
    if (isFilterPending) {
      return <main>Loading filter...</main>;
    }

    if (isFilterError) {
      return <main>Error: {filterError.message}</main>;
    }

    return (
      <ContentWrapper>
        {filteredNotes.active.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
        ))}
        {filteredNotes.archived.length > 0 && (
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
            {filteredNotes.archived.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onNoteClick={setCurrentNoteId}
              />
            ))}
          </>
        )}
      </ContentWrapper>
    );
  }

  if (isPending) {
    return <main>Loading...</main>;
  }

  if (isError) {
    return <main>Error: {error.message}</main>;
  }

  return (
    <ContentWrapper>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onNoteClick={setCurrentNoteId} />
      ))}
    </ContentWrapper>
  );
}
