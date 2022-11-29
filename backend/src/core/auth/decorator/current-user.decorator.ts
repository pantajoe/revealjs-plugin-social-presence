import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { WebSocket } from 'socket.io'
import { User } from '~/core/user/model'

export type Context = 'graphql' | 'http'

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request =
    ctx.getType<GqlContextType>() === 'graphql'
      ? (GqlExecutionContext.create(ctx).getContext().req as Request)
      : ctx.getType<GqlContextType>() === 'ws'
      ? ctx.switchToWs().getClient<WebSocket>().handshake
      : ctx.switchToHttp().getRequest<Request>()
  return request.user as User
})
