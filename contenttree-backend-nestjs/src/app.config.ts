import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exception-handler/all-exceptions.filter.js';
import { TracingLogger } from './common/tracing/tracing-logger.service.js';

/**
 * Common configuration that should be reused in integration tests.
 */
export const configureAppUses = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useLogger(app.get(TracingLogger));
};
