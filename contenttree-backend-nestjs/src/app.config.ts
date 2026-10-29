import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/exception-handler/all-exceptions.filter.js';
import { TracingLogger } from './common/tracing/tracing-logger.service.js';

/**
 * Common configuration that should be reused in integration tests.
 */
export const configureAppUses = (app: INestApplication) => {
  if (!process.env.CORS_ALLOWED_ORIGINS) {
    throw new Error("Environment variable 'CORS_ALLOWED_ORIGINS' is not defined");
  }

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useLogger(app.get(TracingLogger));
  app.use(
    helmet({
      frameguard: { action: 'deny' },
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',').filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true,
    maxAge: 86400,
  });
};
