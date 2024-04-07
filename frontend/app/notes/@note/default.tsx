'use client';

import { useContext } from 'react';
import EmptyState from './components/EmptyState';
import { NotesContext } from '../NotesContext';
import NotePage from './page';

export default function Default() {
  const { currentNoteId } = useContext(NotesContext);

  if (!currentNoteId) {
    return <EmptyState />;
  }
  return <NotePage />;
}
