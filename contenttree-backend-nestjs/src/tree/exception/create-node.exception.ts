import { HttpException } from '@nestjs/common';

export class CreateNodeException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}
