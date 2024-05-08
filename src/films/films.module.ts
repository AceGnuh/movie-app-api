import { Module } from '@nestjs/common';
import { FilmController } from './films.controller';
import { FilmService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '@entities/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  controllers: [FilmController],
  providers: [FilmService],
  exports: [FilmService],
})
export class FilmsModule {}
