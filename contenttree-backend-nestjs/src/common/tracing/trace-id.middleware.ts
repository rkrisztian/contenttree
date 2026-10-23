import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { traceStorage } from './trace-context.js';

declare module 'express' {
  interface Request {
    traceId?: string;
  }
}

const SAFE_TRACE_ID = /^[A-Za-z0-9._:-]{8,128}$/;

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const raw = req.headers['x-trace-id'];
    const rawStr = Array.isArray(raw) ? raw[0] : raw;
    const candidate = rawStr?.trim();
    const traceId = candidate && SAFE_TRACE_ID.test(candidate) ? candidate : randomUUID();

    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);
    traceStorage.run({ traceId }, () => next());
  }
}
