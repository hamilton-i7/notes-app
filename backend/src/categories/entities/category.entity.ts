import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CATEGORY_TITLE_MAX_LENGTH } from '../utilities/constants';
import { Note } from 'src/notes/entities/note.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: CATEGORY_TITLE_MAX_LENGTH })
  name: string;

  @ManyToMany((type) => Note, (note) => note.categories)
  notes: Note[];
}
