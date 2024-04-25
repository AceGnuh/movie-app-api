import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configInformation from './common/setting-information';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configInformation],
    }),
    TypeOrmModule.forRoot({
      type: configInformation().database.type,
      host: configInformation().database.host,
      port: configInformation().database.port,
      username: configInformation().database.username,
      password: configInformation().database.password,
      database: configInformation().database.database,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    FilmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
