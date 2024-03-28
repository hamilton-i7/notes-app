export type CreateNoteDto = {
  title: string;
  content: string;
  archivedAt: string | null;
  categories: number[];
};
