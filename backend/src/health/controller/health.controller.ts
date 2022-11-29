import { Controller, Get, InternalServerErrorException } from '@nestjs/common'
import { Public } from '../../core/auth'
import { HealthService } from '../service'

@Public()
@Controller('.well-known')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health-check')
  async healthCheck() {
    const isHealthy = await this.healthService.checkApplicationStatus()
    if (isHealthy) return 'ok'

    throw new InternalServerErrorException({
      statusCode: 500,
      message: 'Application is not healthy',
      error: 'Internal Server Error',
    })
  }
}
