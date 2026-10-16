import { AsyncLocalStorage } from 'node:async_hooks';

export interface TraceContext {
  traceId: string;
}

export const traceStorage = new AsyncLocalStorage<TraceContext>();
export const getTraceId = () => traceStorage.getStore()?.traceId;
