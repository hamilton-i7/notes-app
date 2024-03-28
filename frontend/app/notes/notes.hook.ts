import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ARCHIVED_NOTES_KEY, NOTES_KEY } from '../lib/constants';
import {
  createNote,
  deleteNote,
  getArchivedNotes,
  getNotes,
  updateNote,
} from './notes.api';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: CreateNoteDto) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateNote = () => {
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note: UpdateNoteDto }) =>
      updateNote(id, note),
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
