import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { DeleteResult, In, IsNull, Not, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ReorderNotesDto } from './dto/reorder-notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { categories } = createNoteDto;
    const notes = await this.notesRepository.find({
      where: { archivedAt: IsNull() },
      order: { position: 'ASC' },
      select: { id: true },
    });
    notes.forEach((note, i) => {
      note.position = i + 1;
    });
    await this.notesRepository.save(notes);
    return this.notesRepository.save({
      ...createNoteDto,
      position: 0,
      categories: categories.map((id) => ({ id }) as Category),
    });
  }

  findAll(): Promise<Note[]> {
    return this.notesRepository.find({
      relations: { categories: true },
      where: { archivedAt: IsNull() },
      order: { position: 'ASC', categories: { name: 'ASC' } },
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
      order: { position: 'ASC', categories: { name: 'ASC' } },
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

    const { categories, archivedAt } = updateNoteDto;
    // Only rearrange all active notes when restoring a note from archives
    if (archivedAt === null) {
      const notes = await this.notesRepository.find({
        where: { archivedAt: IsNull() },
        order: { position: 'ASC' },
        select: { id: true },
      });
      notes.forEach((note, i) => {
        note.position = i + 1;
      });
      await this.notesRepository.save(notes);
    }

    return this.notesRepository.save({
      ...updateNoteDto,
      id,
      categories: categories
        ? categories.map((id) => ({ id }) as Category)
        : undefined,
      position: archivedAt === null ? 0 : undefined,
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.notesRepository.delete(id);
  }

  async reorder({ notes: noteIds }: ReorderNotesDto): Promise<Note[]> {
    const notes = await this.notesRepository.find({
      where: { archivedAt: IsNull() },
      select: { id: true, position: true },
    });
    const notesMap: Record<number, Note> = notes.reduce(
      (acc, note) => ({ ...acc, [note.id]: note }),
      {} as Record<number, Note>,
    );
    const notesToUpdate: Note[] = [];

    noteIds.forEach((id, i) => {
      const note = notesMap[id];
      if (!note) return;
      notesToUpdate.push({ ...note, position: i });
    });
    return this.notesRepository.save(notesToUpdate);
  }
}
