import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { DeleteResult, IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { content } = createNoteDto;
    return this.notesRepository.save({
      ...createNoteDto,
      content: content ?? '',
    });
  }

  findAll(): Promise<Note[]> {
    return this.notesRepository.find({
      where: { archivedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  findArchived(): Promise<Note[]> {
    return this.notesRepository.find({ where: { archivedAt: Not(IsNull()) } });
  }

  findOne(id: number): Promise<Note | null> {
    return this.notesRepository.findOne({ where: { id } });
  }

  update(id: number, updateNoteDto: UpdateNoteDto): Promise<UpdateResult> {
    return this.notesRepository.update(id, updateNoteDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.notesRepository.delete(id);
  }
}
