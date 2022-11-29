import { Injectable } from '@nestjs/common'
import { WebSocket } from 'socket.io'
import { AuthService } from '~/core/auth/service'
import { LectureAccessService } from '~/core/lecture/service'

export interface WebSocketCanActivateOptions {
  requireLecture?: boolean
}

@Injectable()
export class WsAccessGuardService {
  constructor(private readonly authService: AuthService, private readonly lectureAccessService: LectureAccessService) {}

  async canActivate(client: WebSocket, { requireLecture = false }: WebSocketCanActivateOptions = {}): Promise<boolean> {
    const authToken = client.handshake.auth.token as string
    if (!authToken) {
      client.emit('exception', { status: 'error', message: 'UNAUTHORIZED' })
      client.disconnect(true)
      return false
    }

    const user = await this.authService.validateByToken(authToken)
    if (!user) {
      client.emit('exception', { status: 'error', message: 'UNAUTHORIZED' })
      client.disconnect(true)
      return false
    }

    client.handshake.headers.authorization = `Bearer ${authToken}`
    client.handshake.user = user
    if (!requireLecture) return true

    const lectureSlug = client.handshake.query.lecture as string
    if (!lectureSlug) {
      client.emit('exception', { status: 'error', message: 'LECTURE_REQUIRED' })
      client.disconnect(true)
      return false
    }

    const lecture = await this.lectureAccessService.findWsLecture(lectureSlug)
    if (!lecture) {
      client.emit('exception', { status: 'error', message: 'FORBIDDEN' })
      client.disconnect(true)
      return false
    }

    const hasAccess = await this.lectureAccessService.hasWsAccess({ lecture, user })
    if (!hasAccess) {
      client.emit('exception', { status: 'error', message: 'FORBIDDEN' })
      client.disconnect(true)
      return false
    }

    client.handshake.lecture = lecture

    return true
  }
}
