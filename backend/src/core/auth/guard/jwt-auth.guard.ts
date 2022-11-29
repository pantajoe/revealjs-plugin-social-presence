import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { WebSocket } from 'socket.io'
import { IS_PUBLIC_KEY } from '../decorator/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'ws') return context.switchToWs().getClient<WebSocket>().handshake
    if (context.getType<GqlContextType>() !== 'graphql') return context.switchToHttp().getRequest<Request>()

    const ctx = GqlExecutionContext.create(context)
    const { req, connection } = ctx.getContext()
    // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
    return connection?.context?.headers ? connection.context : req
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic || this.usesGraphqlSubscriptions(context)) return true

    return super.canActivate(context)
  }

  private usesGraphqlSubscriptions(context: ExecutionContext) {
    if (context.getType<GqlContextType>() !== 'graphql') return false

    return GqlExecutionContext.create(context).getInfo().operation.operation === 'subscription'
  }
}
