import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { InjectRepository } from '@mikro-orm/nestjs'
import { WebSocket } from 'socket.io'
import { User } from '~/core/user/model'
import { EntityRepository } from '~/orm'
import { TokenService } from '~/core/token/service'

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    private readonly tokenService: TokenService,
  ) {}

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
    const refreshToken = request.cookies?.refreshToken as string
    if (!refreshToken) return false

    const hashedRefreshToken = this.tokenService.digest(refreshToken)
    const user = await this.userRepository.findOne({
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: { $gt: new Date() },
    })
    if (!user) return false

    request.user = user
    return true
  }
}
