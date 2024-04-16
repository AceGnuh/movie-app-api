import { Module } from '@nestjs/common';
import { FilmController } from './films/film.controller';
import { FilmService } from './films/film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './films/film.entity';
import { ConfigModule } from '@nestjs/config';
import configInformation from './config/config-information';
import { CategoryController } from './categories/category.controller';
import { CategoryService } from './categories/category.service';
import { Category } from './categories/category.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configInformation],
    }),
    TypeOrmModule.forRoot({
      ...configInformation().database,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Film, Category]),
  ],
  controllers: [CategoryController, FilmController],
  providers: [CategoryService, FilmService],
})
export class AppModule {
  constructor() {}
}
