import { useQuery } from '@tanstack/react-query';
import { ARCHIVED_NOTES_KET, NOTES_KEY } from '../lib/constants';
import { getArchivedNotes, getNotes } from './notes.api';

export const useGetNotes = () => {
  return useQuery({
    queryKey: [NOTES_KEY],
    queryFn: getNotes,
  });
};

export const useGetArchivedNotes = () => {
  return useQuery({
    queryKey: [ARCHIVED_NOTES_KET],
    queryFn: getArchivedNotes,
  });
};
