import { ConsoleLogger, Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { getTraceId } from './trace-context.js';

@Injectable()
export class TracingLogger implements LoggerService {
  private readonly delegate = new ConsoleLogger({
    logLevels: ((): LogLevel[] => {
      switch (process.env.NODE_ENV) {
        case 'production':
          return ['log'];
        case 'test':
          return ['error'];
        default:
          return ['debug'];
      }
    })(),
  });

  log(message: unknown, ...rest: unknown[]): void {
    this.delegate.log(message, ...this.withTraceId(rest));
  }
  error(message: unknown, ...rest: unknown[]): void {
    this.delegate.error(message, ...this.withTraceId(rest));
  }
  warn(message: unknown, ...rest: unknown[]): void {
    this.delegate.warn(message, ...this.withTraceId(rest));
  }
  debug(message: unknown, ...rest: unknown[]): void {
    this.delegate.debug(message, ...this.withTraceId(rest));
  }
  verbose(message: unknown, ...rest: unknown[]): void {
    this.delegate.verbose(message, ...this.withTraceId(rest));
  }

  private withTraceId(rest: unknown[]): unknown[] {
    const traceId = getTraceId();
    return traceId ? [{ traceId }, ...rest] : rest;
  }
}
