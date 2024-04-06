import { Note } from '../models/note.model';

export type ReorderNotesDto = {
  notes: Note['id'][];
};
