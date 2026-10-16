import { HttpException } from '@nestjs/common';

export class ParentNodeNotFoundException extends HttpException {
  constructor() {
    super('Parent node not found', 404);
  }
}
