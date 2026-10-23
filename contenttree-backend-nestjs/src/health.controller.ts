import { Controller, Get } from '@nestjs/common';

@Controller('/api/ping')
export class HealthController {
  @Get()
  ping() {
    return { status: 'ok' };
  }
}
