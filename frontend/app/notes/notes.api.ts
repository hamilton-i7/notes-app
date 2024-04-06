import axios from '../lib/axiosInstance';
import { CreateNoteDto } from './dto/create-note.dto';
import { ReorderNotesDto } from './dto/reorder-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './models/note.model';

export const getNotes = async () => {
  const response = await axios.get<Note[]>('/notes');
  return response.data;
};

export const getArchivedNotes = async () => {
  const response = await axios.get<Note[]>('/notes/archive');
  return response.data;
};

export const getNotesByCategories = async (category: number) => {
  const response = await axios.get<{ active: Note[]; archived: Note[] }>(
    `/notes?categories=${category}`
  );
  return response.data;
};

export const getNote = async (id: number) => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: CreateNoteDto) => {
  const response = await axios.post<Note>('/notes', note);
  return response.data;
};

export const updateNote = async (id: number, note: UpdateNoteDto) => {
  const response = await axios.patch<Note>(`/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: number) => {
  const response = await axios.delete<string>(`notes/${id}`);
  return response.data;
};

export const reorderNotes = async (dto: ReorderNotesDto) => {
  const response = await axios.patch<Note[]>('notes/reorder', dto);
  return response.data;
};
