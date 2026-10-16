import { HttpException } from '@nestjs/common';

export class MoveNodeException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}
