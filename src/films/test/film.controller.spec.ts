import { FilmController } from '@films/film.controller';
import { FilmService } from '@films/film.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockFilm,
  mockFilmId,
  mockFilmInvalidId,
  mockFilmService,
} from './__mock__/film.mock';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Not } from 'typeorm';

describe('Test Film Controller', () => {
  let filmController: FilmController;
  let filmService: FilmService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        FilmController,
        {
          provide: FilmService,
          useValue: mockFilmService,
        },
      ],
    }).compile();

    filmService = testModule.get<FilmService>(FilmService);
    filmController = testModule.get<FilmController>(FilmController);
  });

  it('it should be defined', () => {
    expect(filmController).toBeDefined();
    expect(filmService).toBeDefined();
  });

  describe('query film', () => {
    it('should return null because the id is invalid', async () => {
      const result = async () => {
        return await filmController.getFilmById(mockFilmInvalidId);
      };
      expect(filmService.findById).not.toHaveBeenCalled();
      expect(result()).rejects.toThrow(NotFoundException);
    });

    it('should return a film object', async () => {
      const film = await filmController.getFilmById(mockFilmId);
      expect(filmService.findById).toHaveBeenCalledWith(mockFilmId);
      expect(film.data).toEqual(mockFilm);
      expect(film.statusCode).toBe(HttpStatus.OK);
    });

    it('should return a list of film object', async () => {
      const result = await filmController.getAllFilms();
      expect(filmService.findAll).toHaveBeenCalled();
      expect(result.data).toEqual([mockFilm]);
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('create film', () => {
    it('should create a new film object', async () => {
      const result = await filmController.createFilm(mockFilm);
      expect(filmService.create).toHaveBeenCalledWith(mockFilm);
      expect(result.data).toEqual(mockFilm);
      expect(result.statusCode).toBe(HttpStatus.CREATED);
    });
  });

  describe('update film', () => {
    it('should update a film object', async () => {
      const result = await filmController.updateFilm(mockFilmId, mockFilm);
      expect(filmService.update).toHaveBeenCalledWith(mockFilmId, mockFilm);
      expect(result.data).toEqual(mockFilm);
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('delete film', () => {
    it('should soft delete a film object', async () => {
      const result = await filmController.deleteFilm(mockFilmId);
      expect(filmService.delete).toHaveBeenCalledWith(mockFilmId);
      expect(result.data).toEqual(mockFilm);
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
  });
});
