import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common'
import { MESSAGES } from '@nestjs/core/constants'
import { WsException } from '@nestjs/websockets'
import { isObject } from 'lodash'
import { WebSocket } from 'socket.io'

@Catch()
export class WsExceptionFilter {
  private static readonly logger = new Logger('WsExceptionsHandler')

  public catch(exception: Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<WebSocket>()
    this.handleError(client, exception)
  }

  public handleError(client: WebSocket, exception: Error) {
    if (exception instanceof WsException) {
      const status = 'error'
      const result = exception.getError()
      const message = isObject(result)
        ? result
        : {
            status,
            message: result,
          }

      client.emit('exception', message)
    }

    if (exception instanceof HttpException) {
      const status = 'error'

      const result = {
        status: exception.getStatus(),
        error: exception.name,
        message: exception.message,
        errors: exception.getResponse(),
      }
      const message = {
        status,
        message: result,
      }

      client.emit('exception', message)
    }

    return this.handleUnknownError(exception, client)
  }

  public handleUnknownError(exception: Error, client: WebSocket) {
    const status = 'error'
    client.emit('exception', {
      status,
      message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
    })

    if (this.isExceptionObject(exception)) return WsExceptionFilter.logger.error(exception.message, exception.stack)

    return WsExceptionFilter.logger.error(exception)
  }

  public isExceptionObject(err: any): err is Error {
    return isObject(err) && !!(err as Error).message
  }
}
