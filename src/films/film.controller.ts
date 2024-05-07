import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Patch,
  ParseUUIDPipe,
  StreamableFile,
  Header,
  Query,
  ValidationPipe,
  UsePipes,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FilmService } from './film.service';
import { Film } from '@entities/film.entity';
import { ResponseDTO } from 'src/dtos/response.dto';
import { CreateFilmDTO } from '@dto/film/create-film.dto';
import { UpdateFilmDTO } from '@dto/film/update-film.dto';
import { PartialUpdateFilmDTO } from '@dto/film/partial-update-film.dto';
import {
  FILM_ERROR_MESSAGE,
  FILM_MESSAGE,
} from '@custom-messages/film.message';
import { Response } from 'express';
import { CustomParseUUIDPipe } from 'src/middlewares/custom-parse-uuid';

@Controller('films')
@UsePipes(new ValidationPipe({ transform: true }))
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  async getAllFilms(
    @Query('key') key?: string,
    @Query('min_view') minView?: string,
    @Query('max_view') maxView?: string,
  ): Promise<ResponseDTO<Film[]>> {
    const films = await this.filmService.findAll(key, minView, maxView);

    return new ResponseDTO<Film[]>(HttpStatus.OK, films);
  }

  @Get(':id')
  async getFilmById(
    @Param('id', CustomParseUUIDPipe) id: string,
  ): Promise<ResponseDTO<Film>> {
    const film = await this.filmService.findById(id);
    return new ResponseDTO<Film>(HttpStatus.OK, film);
  }

  @Post()
  async createFilm(@Body() film: CreateFilmDTO): Promise<ResponseDTO<Film>> {
    const filmCreated = await this.filmService.create(film);

    return new ResponseDTO<Film>(
      HttpStatus.CREATED,
      filmCreated,
      FILM_MESSAGE.CREATE,
    );
  }

  @Put('/:id')
  async updateFilm(
    @Param('id', CustomParseUUIDPipe) id: string,
    @Body() film: UpdateFilmDTO,
  ): Promise<ResponseDTO<Film>> {
    const filmUpdated = await this.filmService.update(id, film);

    return new ResponseDTO<Film>(
      HttpStatus.OK,
      filmUpdated,
      FILM_MESSAGE.UPDATE,
    );
  }

  @Delete('/:id')
  async deleteFilm(
    @Param('id', CustomParseUUIDPipe) id: string,
  ): Promise<ResponseDTO<Film>> {
    const film = await this.filmService.delete(id);

    return new ResponseDTO<Film>(HttpStatus.OK, film, FILM_MESSAGE.DELETE);
  }
}
