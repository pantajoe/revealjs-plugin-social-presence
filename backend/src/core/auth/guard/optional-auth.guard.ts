import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { WebSocket } from 'socket.io'
import { AuthService } from '../service'

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'ws') return context.switchToWs().getClient<WebSocket>().handshake
    if (context.getType<GqlContextType>() !== 'graphql') return context.switchToHttp().getRequest<Request>()

    const ctx = GqlExecutionContext.create(context)
    const { req, connection } = ctx.getContext()
    // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
    return connection?.context?.headers ? connection.context : req
  }

  async canActivate(context: ExecutionContext) {
    const request = this.getRequest(context) as Request
    const {
      headers: { authorization },
    } = this.getRequest(context)
    const authToken = authorization?.split(' ')[1]
    const user = await this.authService.validateUserByToken(authToken)

    if (user) request.user = user
    return true
  }
}
