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
  HttpCode,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NOTE_DELETED, NOTE_NOT_FOUND_ERROR } from './utilities/constants';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(): Promise<Note[]> {
    return this.notesService.findAll();
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const result = await this.notesService.update(id, updateNoteDto);
    if (!result.affected) throw new NotFoundException(NOTE_NOT_FOUND_ERROR);
    return this.notesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.notesService.remove(id);
    if (!result.affected) throw new NotFoundException(NOTE_NOT_FOUND_ERROR);
    return NOTE_DELETED;
  }
}
