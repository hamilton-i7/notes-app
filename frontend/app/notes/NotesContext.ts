import { createContext } from 'react';
import { Note } from './models/note.model';

type ContextProps = {
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  displayAddNote: boolean;
  setDisplayAddNote: (display: boolean) => void;
};

export const NotesContext = createContext<ContextProps>({
  currentNote: null,
  setCurrentNote: () => {},
  displayAddNote: false,
  setDisplayAddNote: () => {},
});
