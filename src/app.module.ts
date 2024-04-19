import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import configInformation from './common/setting-information';
import { FilmsModule } from './films/films.module';
import { CategoriesModule } from './categories/categories.module';

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
    FilmsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
