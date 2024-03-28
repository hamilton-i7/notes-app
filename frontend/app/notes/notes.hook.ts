import { useMutation, useQuery } from '@tanstack/react-query';
import { ARCHIVED_NOTES_KEY, NOTES_KEY } from '../lib/constants';
import { createNote, getArchivedNotes, getNotes } from './notes.api';
import { CreateNoteDto } from './dto/create-note.dto';
import { useContext } from 'react';
import { NotesContext } from './NotesContext';

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
  const { setCurrentNote, setDisplayAddNote } = useContext(NotesContext);

  return useMutation({
    mutationFn: (note: CreateNoteDto) => createNote(note),
    onSuccess: (data) => {
      setDisplayAddNote(false);
      setCurrentNote(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
