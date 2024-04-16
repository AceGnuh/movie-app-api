import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import configInformation from './config/config-information';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transformOptions: {
        exposeUnsetFields: false,
      },
    }),
  );

  await app.listen(configInformation().port);
}

bootstrap();
