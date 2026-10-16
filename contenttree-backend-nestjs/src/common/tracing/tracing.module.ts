import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TraceIdMiddleware } from './trace-id.middleware.js';
import { TracingLogger } from './tracing-logger.service.js';

@Module({
  providers: [TracingLogger],
})
export class TracingModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
