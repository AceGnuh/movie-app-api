import { IsOptional, IsString } from 'class-validator';
import { CreateFilmDTO } from './create-film.dto';
import { Transform } from 'class-transformer';

export class UpdateFilmDTO extends CreateFilmDTO {
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    title: string;
}
