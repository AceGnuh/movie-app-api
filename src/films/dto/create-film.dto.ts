import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Category } from 'src/categories/entities/category.entity';

export class CreateFilmDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsString()
  path: string;

  @IsNumber()
  order: number;

  @IsBoolean()
  status: boolean;

  @IsDateString()
  releaseDate: Date;

  category: Category;
}
