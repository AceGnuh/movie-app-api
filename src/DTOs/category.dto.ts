import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/categories/category.entity';
import { PartialUpdateFilmDTO } from './film.dto';

export class CategoryDTO extends PartialType(Category) {}

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  order: number;
}

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}

export class PartialUpdateCategoryDTO extends PartialUpdateFilmDTO {}
