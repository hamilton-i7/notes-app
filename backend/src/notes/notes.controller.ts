import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NOTE_DELETED, NOTE_NOT_FOUND_ERROR } from './utilities/constants';
import { ReorderNotesDto } from './dto/reorder-notes.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(
    @Query(
      'categories',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    categories: number[],
  ): Promise<Note[] | { active: Note[]; archived: Note[] }> {
    if (!categories) return this.notesService.findAll();
    return this.notesService.findByCategories(categories);
  }

  @Get('/archive')
  findArchived(): Promise<Note[]> {
    return this.notesService.findArchived();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    const note = await this.notesService.findOne(id);
    if (!note) {
      throw new NotFoundException(NOTE_NOT_FOUND_ERROR);
    }
    return note;
  }

  @Patch('/reorder')
  reorder(@Body() reorderNotesDto: ReorderNotesDto) {
    return this.notesService.reorder(reorderNotesDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const note = await this.notesService.update(id, updateNoteDto);
    if (!note) throw new NotFoundException(NOTE_NOT_FOUND_ERROR);
    return this.notesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.notesService.remove(id);
    if (!result.affected) throw new NotFoundException(NOTE_NOT_FOUND_ERROR);
    return NOTE_DELETED;
  }
}
