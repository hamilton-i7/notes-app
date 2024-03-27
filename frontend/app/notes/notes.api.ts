import axios from '../lib/axiosInstance';
import { Note } from './models/note.model';

export const getNotes = async () => {
  const response = await axios.get<Note[]>('/notes');
  return response.data;
};

export const getArchivedNotes = async () => {
  const response = await axios.get<Note[]>('/notes/archive');
  return response.data;
};
