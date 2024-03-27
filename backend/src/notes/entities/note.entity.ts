import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NOTE_TITLE_MAX_LENGTH } from '../utilities/constants';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: NOTE_TITLE_MAX_LENGTH, default: '' })
  title: string;

  @Column({ type: 'mediumtext' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastModified: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  archivedAt: Date | null;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
