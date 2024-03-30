import { IsNumber, Min } from 'class-validator';

export class ReorderNotesDto {
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @Min(1, { each: true })
  ids: number[];
}
