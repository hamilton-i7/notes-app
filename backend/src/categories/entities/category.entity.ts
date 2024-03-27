import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CATEGORY_TITLE_MAX_LENGTH } from '../utilities/constants';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: CATEGORY_TITLE_MAX_LENGTH })
  name: string;
}
