import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './film.entity';
import {
  CreateFilmDTO,
  PartialUpdateFilmDTO,
  UpdateFilmDTO,
} from 'src/DTOs/film.dto';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async findAll(): Promise<Film[]> {
    return await this.filmRepository.find({
      where: {
        status: true,
      },
      order: {
        order: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Film> {
    return await this.filmRepository.findOne({
      where: {
        filmId: id,
        status: true,
      },
    });
  }

  async create(filmData: CreateFilmDTO): Promise<Film> {
    return await this.filmRepository.save(filmData);
  }

  async update(id: string, filmData: UpdateFilmDTO): Promise<Film> {
    await this.filmRepository.update(id, filmData);

    return this.filmRepository.findOne({ where: { filmId: id } });
  }

  async partialUpdate(
    id: string,
    filmData: PartialUpdateFilmDTO,
  ): Promise<Film> {
    const film = await this.filmRepository.findOne({ where: { filmId: id } });

    //update status and order
    film.status = filmData?.status || film.status;
    film.order = filmData?.order || film.order;

    await this.filmRepository.update(id, film);

    //update modify time
    film.modifyAt = new Date();

    return film;
  }

  async delete(id: string): Promise<void> {
    await this.filmRepository.delete(id);
  }
}
