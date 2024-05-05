import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ERROR_MESSAGE } from '@custom-messages/error.message';
import { BadRequestException } from '@nestjs/common';

export class CreateFilmDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  description: string;

  @IsString()
  thumbnail: string;

  @IsNumber({}, { message: ERROR_MESSAGE.IS_NUMBER('view') })
  @Min(1)
  view: number;

  @IsNumber({}, { message: ERROR_MESSAGE.IS_NUMBER('duration') })
  @Min(1)
  duration: number;

  @IsString()
  path: string;

  @IsNumber({}, { message: ERROR_MESSAGE.IS_NUMBER('order') })
  order: number;

  @IsBoolean()
  status: boolean;

  @IsDateString()
  releaseDate: Date;
}
