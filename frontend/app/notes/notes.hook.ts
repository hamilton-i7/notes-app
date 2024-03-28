import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NOTES_KEY, SINGLE_NOTE_KEY } from '../lib/constants';
import {
  createNote,
  deleteNote,
  getArchivedNotes,
  getNote,
  getNotes,
  getNotesByCategories,
  updateNote,
} from './notes.api';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

export const useGetNotes = (enabled = true) => {
  return useQuery({
    queryKey: [NOTES_KEY],
    queryFn: getNotes,
    enabled,
  });
};

export const useGetArchivedNotes = () => {
  return useQuery({
    queryKey: [NOTES_KEY, { archived: true }],
    queryFn: getArchivedNotes,
  });
};

export const useGetNotesByCategories = (
  categories: number[],
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [NOTES_KEY, { categories }],
    queryFn: () => getNotesByCategories(categories),
    enabled,
  });
};

export const useGetNote = (id: number | null, enabled = false) => {
  return useQuery({
    queryKey: [SINGLE_NOTE_KEY, { id }],
    queryFn: () => getNote(id!),
    enabled,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: number; note: UpdateNoteDto }) =>
      updateNote(id, note),
    onSuccess: (data) => {
      queryClient.setQueryData([SINGLE_NOTE_KEY, { id: data.id }], data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_KEY] });
      queryClient.invalidateQueries({
        queryKey: [NOTES_KEY, { archived: true }],
      });
    },
  });
};
