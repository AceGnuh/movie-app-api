import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ERROR_MESSAGE } from '@custom-messages/error.message';

export class CreateFilmDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNumber({}, { message: ERROR_MESSAGE.IS_NUMBER('view') })
  @Min(0)
  @IsOptional()
  view: number;

  @IsNumber({}, { message: ERROR_MESSAGE.IS_NUMBER('duration') })
  @Min(1)
  @IsOptional()
  duration: number;

  @IsString()
  @IsOptional()
  path: string;

  @IsNumber({}, { message: ERROR_MESSAGE.IS_NUMBER('order') })
  @IsOptional()
  order: number;

  @IsBoolean({ message: ERROR_MESSAGE.IS_BOOLEAN('status') })
  @IsOptional()
  status: boolean;

  @IsDate({ message: ERROR_MESSAGE.IS_DATE('release date') })
  @IsDateString({}, { message: ERROR_MESSAGE.IS_DATE('release date') })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return new Date(value);
    } catch (error) {
      throw new Error(ERROR_MESSAGE.IS_DATE('release date'));
    }
  })
  releaseDate: Date;
}
