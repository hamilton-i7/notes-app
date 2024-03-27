import { generateRandomDate } from '../../utilities/functions';
import { Note } from '../entities/note.entity';

export function generateSampleNotes(notesToGenerate: number): Note[] {
  if (notesToGenerate < 1) return [];
  const notes: Note[] = [];
  const now = new Date(Date.now());

  for (let i = 1; i <= notesToGenerate; i++) {
    const date = generateRandomDate(new Date('2023-01-01T12:00:00.000Z'), now);
    const archivedDate = generateRandomDate(date, now);
    const note: Note = {
      id: i,
      title: `Sample Note ${i}`,
      content: `Description for Sample Note ${i}`,
      createdAt: date,
      lastModified: now,
      archivedAt: i % 3 === 0 ? archivedDate : null,
      categories: [],
    };
    notes.push(note);
  }
  return notes;
}
