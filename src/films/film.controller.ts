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
  Patch,
  ParseUUIDPipe,
  StreamableFile,
  Header,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilmService } from './film.service';
import { Film } from './film.entity';
import { ResponseDTO } from 'src/DTOs/response.dto';
import {
  CreateFilmDTO,
  UpdateFilmDTO,
  PartialUpdateFilmDTO,
} from 'src/DTOs/film.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/auth.decorator';

@Public()
@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Public()
  @Get()
  async getAllFilms(): Promise<ResponseDTO<Film[]>> {
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
  @UseInterceptors(FileInterceptor('file'))
  async createFilm(@Body() film: CreateFilmDTO): Promise<ResponseDTO<Film>> {
    const filmCreated = await this.filmService.create(film);

    return new ResponseDTO<Film>(HttpStatus.CREATED, filmCreated);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFilm(@UploadedFile() file: Express.Multer.File): Promise<string> {
    console.log('File data', file);

    return file.filename;
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
