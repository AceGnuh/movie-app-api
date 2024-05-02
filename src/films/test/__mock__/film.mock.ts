import { FILM_ERROR_MESSAGE } from '@custom-messages/film.message';
import { CreateFilmDTO } from '@dto/film/create-film.dto';
import { UpdateFilmDTO } from '@dto/film/update-film.dto';
import { Film } from '@entities/film.entity';
import { BadRequestException } from '@nestjs/common';

export const mockFilm: Film = {
  filmId: 'ca519142-a44d-45fd-98a5-298df1b72fa6',
  title: 'The Godfather',
  description:
    'A young girl enters the world of spirits and must find a way to save her parents.',
  status: true,
  view: 12000,
  duration: 120,
  thumbnail: 'spirited_away.png',
  path: 'movies/spirited_away.mkv',
  order: 3,
  director: 'Hayao Miyazaki',
  releaseDate: new Date('2001-07-20T00:00:00.000Z'),
  createAt: new Date('2024-04-24T07:00:06.720Z'),
  modifyAt: new Date('2024-04-24T07:00:06.720Z'),
  deleteAt: null,
};

export const mockFilmUpdate: Film = {
  filmId: 'b055053d-215b-4beb-95d1-a6b4e352d0ff',
  title: 'The Godfather',
  description:
    'A young girl enters the world of spirits and must find a way to save her parents.',
  status: true,
  view: 12000,
  duration: 120,
  thumbnail: 'spirited_away.png',
  path: 'movies/spirited_away.mkv',
  order: 3,
  director: 'Hayao Miyazaki',
  releaseDate: new Date('2001-07-20T00:00:00.000Z'),
  createAt: new Date('2024-04-24T07:00:06.720Z'),
  modifyAt: new Date('2024-04-24T07:00:06.720Z'),
  deleteAt: null,
};

export const mockFilmTitleExist = 'The Godfather 2';

export const mockFilmId = 'ca519142-a44d-45fd-98a5-298df1b72fa6';
export const mockFilmInvalidId = 'ca519142-a44d-45fd-98a5-298df1b72fa7';

export const mockFilmService = {
  findById: jest.fn().mockImplementation((id: string) => {
    if (id !== mockFilmId) {
      return null;
    }
    return mockFilm;
  }),
  findAll: jest.fn().mockImplementation(() => [mockFilm]),
  create: jest.fn().mockImplementation((film: CreateFilmDTO) => {
    if (film.title === mockFilmTitleExist) {
      throw new BadRequestException(FILM_ERROR_MESSAGE.TITLE_EXIST);
    }
    return mockFilm;
  }),
  update: jest
    .fn()
    .mockImplementation((filmId: string, film: UpdateFilmDTO) => {
      if (filmId != mockFilm.filmId) {
        throw new BadRequestException(FILM_ERROR_MESSAGE.NOT_FOUND);
      }

      if (film.title === mockFilmTitleExist) {
        throw new BadRequestException(FILM_ERROR_MESSAGE.TITLE_EXIST);
      }

      return mockFilm;
    }),
  delete: jest.fn().mockResolvedValue(mockFilm),
};

export const mockFilmRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};
