import { HttpException } from '@nestjs/common';

export class NodeNotFoundException extends HttpException {
  constructor(cause?: unknown) {
    super('Node not found', 404, { cause });
  }
}
