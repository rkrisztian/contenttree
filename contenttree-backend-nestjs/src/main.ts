import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/exception-handler/all-exceptions.filter.js';
import { TracingLogger } from './common/tracing/tracing-logger.service.js';

const bootstrap = async () => {
  const app = (
    await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: [process.env.NODE_ENV === 'production' ? 'log' : 'debug'],
      bufferLogs: process.env.NODE_ENV !== 'production',
    })
  )
    .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    .useGlobalFilters(new AllExceptionsFilter())
    .enableShutdownHooks();

  if (process.env.NODE_ENV !== 'production') {
    configureOpenApi(app);
  }

  app.useLogger(app.get(TracingLogger));
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
