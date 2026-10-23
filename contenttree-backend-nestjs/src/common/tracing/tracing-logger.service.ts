import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { getTraceId } from './trace-context.js';

@Injectable()
export class TracingLogger implements LoggerService {
  private readonly delegate = new ConsoleLogger();

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

    const last = rest[rest.length - 1];
    if (typeof last === 'string') {
      return [...rest.slice(0, -1), `${last}:${traceId}`];
    }
    return [...rest, `trace:${traceId}`];
  }
}
