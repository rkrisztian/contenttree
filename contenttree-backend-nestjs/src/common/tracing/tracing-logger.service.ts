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
          return ['warn'];
        default:
          return ['debug'];
      }
    })(),
  });

  log(message: unknown, ...rest: unknown[]): void {
    this.delegate.log(message, ...this.appendTraceIdAsContext(rest));
  }
  error(message: unknown, ...rest: unknown[]): void {
    this.delegate.error(message, ...this.appendTraceIdAsContext(rest));
  }
  warn(message: unknown, ...rest: unknown[]): void {
    this.delegate.warn(message, ...this.appendTraceIdAsContext(rest));
  }
  debug(message: unknown, ...rest: unknown[]): void {
    this.delegate.debug(message, ...this.appendTraceIdAsContext(rest));
  }
  verbose(message: unknown, ...rest: unknown[]): void {
    this.delegate.verbose(message, ...this.appendTraceIdAsContext(rest));
  }

  private appendTraceIdAsContext(rest: unknown[]): unknown[] {
    const traceId = getTraceId();
    if (!traceId) return rest;

    const last = rest.at(-1);
    if (typeof last === 'string') {
      return [...rest.slice(0, -1), `${last}:${traceId}`];
    }
    return [...rest, `trace:${traceId}`];
  }
}
