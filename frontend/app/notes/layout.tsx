'use client';

import React, { useState } from 'react';
import { NotesContext } from './NotesContext';
import { Note } from './models/note.model';

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
      {children}
      {currentNoteId && note}
      {displayAddNote && addNote}
    </NotesContext.Provider>
  );
}
