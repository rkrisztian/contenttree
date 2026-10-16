import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { getTraceId } from '../tracing/trace-context.js';

interface ErrorResponseBody {
  error?: string;
  message: string;
  traceId: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (res.headersSent) {
      // Streaming/SSE already started; can't rewrite the payload.
      this.logger.error(
        `Late failure after headers sent: ${req.method} ${req.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      return;
    }

    // TODO ensure Trace ID is always defined
    const traceId = req.traceId ?? getTraceId() ?? 'undefined';

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, error } = this.extractMessageAndError(exception);
    const summary = `${req.method} ${req.originalUrl} -> ${status} [traceId=${traceId}]`;

    if (status >= 500) {
      this.logger.error(summary, exception instanceof Error ? exception.stack : String(exception));
    } else {
      this.logger.warn(`${summary} ${JSON.stringify(message)}`);
    }

    const body: ErrorResponseBody = {
      message,
      ...(error ? { error } : {}),
      traceId,
    };

    res.status(status).json(body);
  }

  private extractMessageAndError(exception: unknown): { message: string; error?: string } {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return { message: payload };
      } else if (payload && typeof payload === 'object') {
        const p = payload as Record<string, unknown>;

        return {
          message: (p.message as string) ?? exception.message,
          error: typeof p.error === 'string' ? p.error : undefined,
        };
      }
    }

    return { message: 'Internal server error' };
  }
}
