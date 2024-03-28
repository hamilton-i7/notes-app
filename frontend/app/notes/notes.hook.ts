import { useMutation, useQuery } from '@tanstack/react-query';
import { ARCHIVED_NOTES_KEY, NOTES_KEY } from '../lib/constants';
import {
  createNote,
  deleteNote,
  getArchivedNotes,
  getNotes,
} from './notes.api';
import { CreateNoteDto } from './dto/create-note.dto';

export const useGetNotes = () => {
  return useQuery({
    queryKey: [NOTES_KEY],
    queryFn: getNotes,
  });
};

export const useGetArchivedNotes = () => {
  return useQuery({
    queryKey: [ARCHIVED_NOTES_KEY],
    queryFn: getArchivedNotes,
  });
};

export const useCreateNote = () => {
  return useMutation({
    mutationFn: (note: CreateNoteDto) => createNote(note),
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteNote = () => {
  return useMutation({
    mutationFn: (id: number) => deleteNote(id),
  });
};
