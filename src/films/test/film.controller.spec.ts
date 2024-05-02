import { FilmController } from '@films/film.controller';
import { FilmService } from '@films/film.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockFilm,
  mockFilmId,
  mockFilmInvalidId,
  mockFilmService,
} from './__mock__/film.mock';

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
      const result = await filmController.getFilmById(mockFilmInvalidId);
      expect(filmService.findById).toHaveBeenCalled();
      expect(result.data).toBeNull();
    });

    it('should return a film object', async () => {
      const film = await filmController.getFilmById(mockFilmId);
      expect(filmService.findById).toHaveBeenCalledWith(mockFilmId);
      expect(film.data).toEqual(mockFilm);
    });

    it('should return a list of film object', async () => {
      const result = await filmController.getAllFilms();
      expect(filmService.findAll).toHaveBeenCalled();
      expect(result.data).toEqual([mockFilm]);
    });
  });

  describe('create film', () => {
    it('should create a new film object', async () => {
      const result = await filmController.createFilm(mockFilm);
      expect(filmService.create).toHaveBeenCalledWith(mockFilm);
      expect(result.data).toEqual(mockFilm);
    });
  });

  describe('update film', () => {
    it('should update a film object', async () => {
      const result = await filmController.updateFilm(mockFilmId, mockFilm);
      expect(filmService.update).toHaveBeenCalledWith(mockFilmId, mockFilm);
      expect(result.data).toEqual(mockFilm);
    });
  });
});
