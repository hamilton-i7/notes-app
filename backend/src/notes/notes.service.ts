import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { DeleteResult, In, IsNull, Not, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { categories } = createNoteDto;
    return this.notesRepository.save({
      ...createNoteDto,
      categories: categories.map((id) => ({ id }) as Category),
    });
  }

  findAll(): Promise<Note[]> {
    return this.notesRepository.find({
      relations: { categories: true },
      where: { archivedAt: IsNull() },
      order: { createdAt: 'DESC', categories: { name: 'ASC' } },
      select: { categories: { id: true, name: true } },
    });
  }

  findArchived(): Promise<Note[]> {
    return this.notesRepository.find({
      relations: { categories: true },
      where: { archivedAt: Not(IsNull()) },
      order: { archivedAt: 'DESC', categories: { name: 'ASC' } },
      select: { categories: { id: true, name: true } },
    });
  }

  async findByCategories(
    categories: number[],
  ): Promise<{ active: Note[]; archived: Note[] }> {
    const activeNotes = await this.notesRepository.find({
      relations: { categories: true },
      where: {
        archivedAt: IsNull(),
        categories: {
          id: In(categories),
        },
      },
      order: { createdAt: 'DESC', categories: { name: 'ASC' } },
    });

    const archivedNotes = await this.notesRepository.find({
      relations: { categories: true },
      where: {
        archivedAt: Not(IsNull()),
        categories: {
          id: In(categories),
        },
      },
      order: { archivedAt: 'DESC', categories: { name: 'ASC' } },
    });

    return { active: activeNotes, archived: archivedNotes };
  }

  findOne(id: number): Promise<Note | null> {
    return this.notesRepository.findOne({
      where: { id },
      relations: { categories: true },
      order: { categories: { name: 'ASC' } },
    });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    const exists = await this.notesRepository.existsBy({ id });
    if (!exists) return null;

    const { categories } = updateNoteDto;
    return this.notesRepository.save({
      ...updateNoteDto,
      id,
      categories: categories
        ? categories.map((id) => ({ id }) as Category)
        : undefined,
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.notesRepository.delete(id);
  }
}
