import { IsDefined, IsString, MaxLength } from 'class-validator';
import { CATEGORY_TITLE_MAX_LENGTH } from '../utilities/constants';

export class CreateCategoryDto {
  @IsDefined()
  @IsString()
  @MaxLength(CATEGORY_TITLE_MAX_LENGTH)
  name: string;
}
