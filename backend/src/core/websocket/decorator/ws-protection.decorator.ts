import {
  ClassSerializerInterceptor,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  applyDecorators,
} from '@nestjs/common'
import { WsExceptionFilter } from '../exception'
import { AuthorizationGuard } from '~/core/auth'

export function WsProtection() {
  return applyDecorators(
    UseFilters(WsExceptionFilter),
    UseInterceptors(ClassSerializerInterceptor),
    UsePipes(new ValidationPipe({ whitelist: true, transform: true })),
    UseGuards(AuthorizationGuard),
  )
}
