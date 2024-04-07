import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { NOTE_CONTENT_MAX_LENGTH } from '../utilities/constants';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsOptional()
  @MaxLength(NOTE_CONTENT_MAX_LENGTH)
  content?: string;

  @IsOptional()
  @IsBoolean()
  favorite?: boolean;
}
