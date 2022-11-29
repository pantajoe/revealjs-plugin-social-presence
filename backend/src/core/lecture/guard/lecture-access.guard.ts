import { MikroORM } from '@mikro-orm/core'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import { WebSocket } from 'socket.io'
import { NO_LECTURE_KEY } from '../decorator'
import { Lecture } from '../model'
import { LectureAccessService } from '../service'
import { LECTURE_FILTER_KEY } from '@/mikro-orm.config'
import { IS_PUBLIC_KEY } from '~/core/auth'

@Injectable()
export class LectureAccessGuard implements CanActivate {
  constructor(
    private readonly orm: MikroORM,
    private readonly reflector: Reflector,
    private readonly lectureAccessService: LectureAccessService,
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
    if (this.usesGraphqlSubscriptions(context)) return true

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const noLectureNeeded = this.reflector.getAllAndOverride<boolean>(NO_LECTURE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (noLectureNeeded) return true

    const request = this.getRequest(context)
    const lectureSlug =
      context.getType() === 'ws'
        ? (request as WebSocket['handshake']).auth.lecture
        : ((request as Request).headers['x-lecture'] as string)
    if (!lectureSlug) return false

    const lecture = await this.lectureAccessService.findLecture(lectureSlug)
    if (!lecture) return false

    const hasAccess = await this.lectureAccessService.hasAccess({ lecture, user: request.user })
    if (!hasAccess) return false

    request.lecture = lecture
    this.setOrmFilters(lecture)

    return true
  }

  private usesGraphqlSubscriptions(context: ExecutionContext) {
    if (context.getType<GqlContextType>() !== 'graphql') return false

    return GqlExecutionContext.create(context).getInfo().operation.operation === 'subscription'
  }

  private setOrmFilters(lecture: Lecture) {
    this.orm.em.setFilterParams(LECTURE_FILTER_KEY, { lecture })
  }
}
