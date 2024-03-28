import { createContext } from 'react';
import { Note } from './models/note.model';

type ContextProps = {
  currentNoteId: number | null;
  setCurrentNoteId: (id: number | null) => void;
  displayAddNote: boolean;
  setDisplayAddNote: (display: boolean) => void;
};

export const NotesContext = createContext<ContextProps>({
  currentNoteId: null,
  setCurrentNoteId: () => {},
  displayAddNote: false,
  setDisplayAddNote: () => {},
});
