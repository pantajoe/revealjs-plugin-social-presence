import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { instanceToPlain } from 'class-transformer'
import { Server, WebSocket } from 'socket.io'
import { MousePositionDto, SlideLocationDto } from '../dto'
import { CurrentUser } from '~/core/auth'
import { buildCorsOptions } from '~/core/util'
import { WsAccessGuardService, WsProtection } from '~/core/websocket'
import { User } from '~/core/user/model'

interface Location {
  mouse: MousePositionDto
  slide: SlideLocationDto
}

interface ClientData {
  userId: string
  location: Partial<Location>
}

@WebSocketGateway(8080, {
  namespace: 'activity',
  path: '/presence',
  cors: buildCorsOptions({ credentials: false, origin: '*' }),
})
@WsProtection()
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private readonly guard: WsAccessGuardService, private readonly orm: MikroORM) {}

  @UseRequestContext()
  async handleConnection(client: WebSocket, ..._args: any[]) {
    const canActivate = await this.guard.canActivate(client, { requireLecture: true })
    if (!canActivate) return false

    const { user, lecture } = client.handshake

    client.join(lecture.toGlobalId())
    client.data = {
      userId: user.id,
      location: {},
    } as ClientData
    client.emit('ack')
    this.server.to(lecture.toGlobalId()).emit('online', client.data)
  }

  handleDisconnect(client: WebSocket) {
    if (!client.handshake.user) return

    const {
      data = {},
      handshake: { lecture, user },
    } = client
    if (!lecture) return

    client.leave(lecture.toGlobalId())
    this.server
      .to(lecture.toGlobalId())
      .emit('offline', { ...data, userId: user.id, location: data.location ?? {} } as ClientData)
  }

  @SubscribeMessage('online-users')
  async fetchActiveUsers(@ConnectedSocket() client: WebSocket) {
    const sockets = await this.server.in(client.handshake.lecture.toGlobalId()).fetchSockets()
    const activeUsers = sockets
      .map((socket) => (socket.id !== client.id ? (socket.data as ClientData) : null))
      .filter((d): d is ClientData => Boolean(d))
    client.emit('online-users', activeUsers)
  }

  @SubscribeMessage('switch-slide')
  async onSlideSwitched(
    @MessageBody() data: SlideLocationDto,
    @ConnectedSocket() client: WebSocket,
    @CurrentUser() user: User,
  ) {
    const payload: ClientData = {
      userId: client.handshake.user?.id ?? user.id,
      location: {
        slide: { ...(instanceToPlain(data) as SlideLocationDto) },
        mouse: (client.data as ClientData | undefined)?.location.mouse,
      },
    }

    client.data = payload
    client.broadcast.to(client.handshake.lecture.toGlobalId()).emit('switch-slide', payload)
  }

  @SubscribeMessage('mouse-move')
  async onMouseMove(
    @MessageBody() data: MousePositionDto,
    @ConnectedSocket() client: WebSocket,
    @CurrentUser() user: User,
  ) {
    const payload: ClientData = {
      userId: client.handshake.user?.id ?? user.id,
      location: {
        slide: (client.data as ClientData | undefined)?.location.slide,
        mouse: { ...(instanceToPlain(data) as MousePositionDto) },
      },
    }

    client.data = payload
    client.broadcast.to(client.handshake.lecture.toGlobalId()).emit('mouse-move', payload)
  }
}
