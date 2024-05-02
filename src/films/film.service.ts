import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, IsNull, Repository } from 'typeorm';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Film } from '@entities/film.entity';
import { CreateFilmDTO } from '@dto/film/create-film.dto';
import { UpdateFilmDTO } from '@dto/film/update-film.dto';
import { PartialUpdateFilmDTO } from '@dto/film/partial-update-film.dto';
import { FILM_ERROR_MESSAGE } from '@custom-messages/film.message';
import { ERROR_MESSAGE } from '@custom-messages/error.message';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async findAll(
    key?: string,
    minView?: string,
    maxView?: string,
  ): Promise<Film[]> {
    key = key ?? '';

    if ((!parseInt(minView) && minView) || (!parseInt(maxView) && maxView)) {
      throw new BadRequestException(
        ERROR_MESSAGE.VALUE_NOT_APPROPRIATE('min view or max view'),
      );
    }

    const customMinView = parseInt(minView) || 0;
    const customMaxView = parseInt(maxView) || Number.MAX_SAFE_INTEGER;

    if (customMinView < 0) {
      throw new BadRequestException(ERROR_MESSAGE.MIN_VALUE('min view'));
    }

    if (customMaxView < 0) {
      throw new BadRequestException(ERROR_MESSAGE.MIN_VALUE('max view'));
    }

    if (minView > maxView) {
      throw new BadRequestException(
        ERROR_MESSAGE.VALUE_MUST_BE_GREATER_THAN_OTHER_VALUE(
          'max view',
          'min view',
        ),
      );
    }

    const films = await this.filmRepository.find({
      where: [
        {
          view: Between(customMinView, customMaxView),
          status: true,
          title: ILike(`%${key}%`),
        },
        {
          view: Between(customMinView, customMaxView),
          status: true,
          director: ILike(`%${key}%`),
        },
      ],
      order: {
        order: 'DESC',
      },
    });

    if (!films.length) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND);
    }

    return films;
  }

  async findById(id: string): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: {
        filmId: id,
        status: true,
      },
    });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND);
    }

    return film;
  }

  async readThumbnail(id: string) {
    const film = await this.filmRepository.findOne({
      where: {
        filmId: id,
        status: true,
      },
    });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND);
    }

    const thumbnailFilmData = film.thumbnail;
    const thumbnailFilmImage = createReadStream(
      join(process.cwd(), 'resource', 'images', thumbnailFilmData),
    );
    return new StreamableFile(thumbnailFilmImage);
  }

  async create(filmData: CreateFilmDTO): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: {
        title: filmData.title,
        deleteAt: IsNull(),
      },
    });

    if (film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.TITLE_EXIST);
    }

    return await this.filmRepository.save(filmData);
  }

  async update(id: string, filmData: UpdateFilmDTO): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: {
        filmId: id,
      },
    });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND);
    }

    const filmByTitle = await this.filmRepository.findOne({
      where: {
        title: filmData.title,
        deleteAt: IsNull(),
      },
    });

    if (film && film.filmId !== filmByTitle.filmId) {
      throw new BadRequestException(FILM_ERROR_MESSAGE.TITLE_EXIST);
    }

    await this.filmRepository.update(id, filmData);

    const responseFilm = { ...film, ...filmData };
    return responseFilm;
  }

  async partialUpdate(
    id: string,
    filmData: PartialUpdateFilmDTO,
  ): Promise<Film> {
    const film = await this.filmRepository.findOne({ where: { filmId: id } });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND);
    }

    //update status and order
    film.status = filmData?.status || film.status;
    film.order = filmData?.order || film.order;
    film.modifyAt = new Date();

    await this.filmRepository.update(id, film);
    return film;
  }

  async delete(id: string): Promise<Film> {
    const film = await this.filmRepository.findOne({ where: { filmId: id } });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND);
    }

    await this.filmRepository.softDelete(id);
    return film;
  }
}
