import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from './middlewares/validation-pipe.middleware';
import { AppModule } from './app.module';
import configInformation from './common/setting-information';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configInformation().port);
}

bootstrap();
