import axios from '../lib/axiosInstance';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './models/note.model';

export const getNotes = async () => {
  const response = await axios.get<Note[]>('/notes');
  return response.data;
};

export const getArchivedNotes = async () => {
  const response = await axios.get<Note[]>('/notes/archive');
  return response.data;
};

export const createNote = async (note: CreateNoteDto) => {
  const response = await axios.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: number) => {
  const response = await axios.delete<string>(`notes/${id}`);
  return response.data;
};
