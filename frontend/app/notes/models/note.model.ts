import { Category } from '@/app/categories/models/category.model';

export type Note = {
  id: number;
  title: string;
  content: string;
  favorite: boolean;
  createdAt: string;
  lastModified: string;
  archivedAt: string | null;
  categories: Category[];
};
