import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  EMPTY_NOTE_ERROR,
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
} from '../utilities/constants';
import { OnlyOneEmpty } from '../decorators/only-one-empty.decorator';

export class CreateNoteDto {
  @IsDefined()
  @IsString()
  @MaxLength(NOTE_TITLE_MAX_LENGTH)
  title: string;

  @IsDefined()
  @MaxLength(NOTE_CONTENT_MAX_LENGTH)
  @OnlyOneEmpty('title', { message: EMPTY_NOTE_ERROR })
  content: string;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 }, { each: true })
  @Min(1, { each: true })
  categories: number[];
}
