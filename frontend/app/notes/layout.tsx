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
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [displayAddNote, setDisplayAddNote] = useState(false);

  return (
    <NotesContext.Provider
      value={{ currentNote, setCurrentNote, displayAddNote, setDisplayAddNote }}
    >
      {children}
      {note}
      {displayAddNote && addNote}
    </NotesContext.Provider>
  );
}
