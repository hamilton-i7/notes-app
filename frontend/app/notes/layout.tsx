'use client';

import React, { useState } from 'react';
import { NotesContext } from './NotesContext';
import { Note } from './models/note.model';
import { Stack } from '@mui/material';

export default function NotesLayout({
  children,
  note,
  addNote,
}: {
  children: React.ReactNode;
  note: React.ReactNode;
  addNote: React.ReactNode;
}) {
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
  const [displayAddNote, setDisplayAddNote] = useState(false);

  return (
    <NotesContext.Provider
      value={{
        currentNoteId,
        setCurrentNoteId,
        displayAddNote,
        setDisplayAddNote,
      }}
    >
      <Stack direction="row" sx={{ height: { lg: '100vh' } }}>
        {children}
        {displayAddNote ? addNote : note}
      </Stack>
    </NotesContext.Provider>
  );
}
