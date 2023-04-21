import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { isEnv } from '~/util'

export function buildCorsOptions(overrides: Partial<CorsOptions> = {}): CorsOptions {
  return {
    origin: isEnv('staging', 'production') ? new RegExp(`${process.env.DOMAIN}$`) : /(localhost|127\.0\.0\.1)/,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type', 'x-lecture'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    ...overrides,
  }
}
