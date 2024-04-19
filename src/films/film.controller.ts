/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
  HttpCode,
  Request,
  Patch,
  ParseUUIDPipe,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { FilmService } from './film.service';
import { Film } from './entities/film.entity';
import { ResponseDTO } from 'src/common/response.dto';
import { CreateFilmDTO } from 'src/films/dto/create-film.dto';
import { UpdateFilmDTO } from './dto/update-film.dto';
import { PartialUpdateFilmDTO } from './dto/partial-update-film.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Public } from 'src/auth/auth.decorator';

@Public()
@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  async getAllFilms(@Request() req): Promise<ResponseDTO<Film[]>> {
    const films = await this.filmService.findAll();

    if (!films.length) {
      throw new NotFoundException('No films found');
    }

    return new ResponseDTO<Film[]>(HttpStatus.OK, films);
  }

  @Get(':id')
  async getFilmById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDTO<Film>> {
    const film = await this.filmService.findById(id.trim());

    if (!film) {
      throw new NotFoundException('Film not found or not available');
    }

    return new ResponseDTO<Film>(HttpStatus.OK, film);
  }

  @Get(':id/thumbnail')
  @Header('Content-Type', 'image/png')
  async getImageFilm(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const film = await this.filmService.findById(id);

    if (!film || !film.status) {
      throw new NotFoundException('Film not found or not available');
    }

    const thumbnailFilmData = film.thumbnail;
    const thumbnailFilmImage = createReadStream(
      join(process.cwd(), 'resource', 'images', thumbnailFilmData),
    );

    return new StreamableFile(thumbnailFilmImage);
  }

  @Post()
  async createFilm(@Body() film: CreateFilmDTO): Promise<ResponseDTO<Film>> {
    const filmCreated = await this.filmService.create(film);

    return new ResponseDTO<Film>(HttpStatus.CREATED, filmCreated);
  }

  @Put('/:id')
  async updateFilm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() film: UpdateFilmDTO,
  ): Promise<ResponseDTO<Film>> {
    const filmUpdated = await this.filmService.update(id.trim(), film);

    if (!filmUpdated) {
      throw new NotFoundException('Film not found');
    }

    return new ResponseDTO<Film>(HttpStatus.CREATED, filmUpdated);
  }

  @Patch('/:id')
  async updatePartialFilm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() film: PartialUpdateFilmDTO,
  ): Promise<ResponseDTO<Film>> {
    const filmUpdated = await this.filmService.partialUpdate(id, film);

    if (!filmUpdated) {
      throw new NotFoundException('Film not found');
    }

    return new ResponseDTO<Film>(HttpStatus.OK, filmUpdated);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFilm(@Param('id') id: string): Promise<void> {
    await this.filmService.delete(id);
  }
}
