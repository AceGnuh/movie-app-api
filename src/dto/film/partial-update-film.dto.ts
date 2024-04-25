/* eslint-disable prettier/prettier */
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

/* eslint-disable prettier/prettier */
export class PartialUpdateFilmDTO {
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsNumber()
  @IsOptional()
  order: number;
}
