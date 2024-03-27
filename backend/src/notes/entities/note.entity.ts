import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NOTE_TITLE_MAX_LENGTH } from '../utilities/constants';

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
}
