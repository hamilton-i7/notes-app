'use client';

import React, { useState } from 'react';
import { NotesContext } from './NotesContext';
import { Note } from './models/note.model';

export default function NotesLayout({
  children,
  note,
}: {
  children: React.ReactNode;
  note: React.ReactNode;
}) {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  return (
    <NotesContext.Provider value={{ currentNote, setCurrentNote }}>
      {children}
      {note}
    </NotesContext.Provider>
  );
}
