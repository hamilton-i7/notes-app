import { IsNumber, Min } from 'class-validator';

export class ReorderNotesDto {
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  notes: number[];
}
