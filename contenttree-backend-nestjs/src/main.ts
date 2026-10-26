import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configureAppUses } from './app.config.js';
import { AppModule } from './app.module.js';

const bootstrap = async () => {
  const app = (
    await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: process.env.NODE_ENV !== 'production',
    })
  ).enableShutdownHooks();

  configureAppUses(app);
  if (process.env.NODE_ENV !== 'production') {
    configureOpenApi(app);
  }

  app.set('trust proxy', 'loopback');
  await app.listen(process.env.PORT ?? 3000);

  Logger.log(`listening on ${await app.getUrl()}`);
};

const configureOpenApi = (app: INestApplication) => {
  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Content Tree Management App API')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
          },
          'JWT-auth',
        )
        .build(),
    ),
  );
};

await bootstrap();
