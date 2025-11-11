import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/common/controller/base.controller';

@Controller('health')
export class HealthController extends BaseController {
  constructor() {
    super();
  }
  @Get()
  check() {
    return this.createResponse(
      { status: 'ok', timestamp: new Date().toISOString() },
      'Health check passed',
    );
  }
}
