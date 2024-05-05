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
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDTO<Film>> {
    const film = await this.filmService.findById(id);
    return new ResponseDTO<Film>(HttpStatus.OK, film);
  }

  @Get(':id/thumbnail')
  @Header('Content-Type', 'image/png')
  async getImageFilm(
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    try {
      return await this.filmService.readThumbnail(id);
    } catch (error) {
      res.set({
        'Content-Type': 'application/json',
      });
      throw new NotFoundException(FILM_ERROR_MESSAGE.THUMBNAIL_NOT_FOUND);
    }
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() film: UpdateFilmDTO,
  ): Promise<ResponseDTO<Film>> {
    const filmUpdated = await this.filmService.update(id, film);

    return new ResponseDTO<Film>(
      HttpStatus.OK,
      filmUpdated,
      FILM_MESSAGE.UPDATE,
    );
  }

  @Patch('/:id')
  async updatePartialFilm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() film: PartialUpdateFilmDTO,
  ): Promise<ResponseDTO<Film>> {
    const filmUpdated = await this.filmService.partialUpdate(id, film);

    return new ResponseDTO<Film>(
      HttpStatus.OK,
      filmUpdated,
      FILM_MESSAGE.UPDATE,
    );
  }

  @Delete('/:id')
  async deleteFilm(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseDTO<Film>> {
    const film = await this.filmService.delete(id);

    return new ResponseDTO<Film>(HttpStatus.OK, film, FILM_MESSAGE.DELETE);
  }
}
