import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, IsNull, Not, Repository } from 'typeorm';
import { Film } from '@entities/film.entity';
import { CreateFilmDTO } from '@dto/film/create-film.dto';
import { UpdateFilmDTO } from '@dto/film/update-film.dto';
import { PartialUpdateFilmDTO } from '@dto/film/partial-update-film.dto';
import { FILM_ERROR_MESSAGE } from '@custom-messages/film.message';
import { ERROR_MESSAGE } from '@custom-messages/error.message';
import { SearchQuery } from '@dto/search-query.dto';

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

    if (customMinView > customMaxView) {
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
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND_ID);
    }

    return film;
  }

  async create(filmData: CreateFilmDTO): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: {
        title: filmData.title,
        deletedAt: IsNull(),
      },
    });

    if (film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.TITLE_EXIST);
    }

    try {
      const createdFilm = await this.filmRepository.save(filmData);
      return createdFilm;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, filmData: UpdateFilmDTO): Promise<Film> {
    const film: Film = await this.filmRepository.findOne({
      where: {
        filmId: id,
      },
    });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND_ID);
    }

    const filmByTitle: Film = await this.filmRepository.findOne({
      where: {
        filmId: Not(id),
        title: filmData.title || '',
        deletedAt: IsNull(),
      },
    });

    if (filmByTitle) {
      throw new BadRequestException(FILM_ERROR_MESSAGE.TITLE_EXIST);
    }

    try {
      Object.assign(film, filmData);
      const createdFilm = await this.filmRepository.save(film);
      return createdFilm;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<Film> {
    const film = await this.filmRepository.findOne({ where: { filmId: id } });

    if (!film) {
      throw new NotFoundException(FILM_ERROR_MESSAGE.NOT_FOUND_ID);
    }

    await this.filmRepository.softDelete(id);
    return film;
  }
}
