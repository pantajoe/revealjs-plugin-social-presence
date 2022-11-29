import { Logger } from '@nestjs/common'
import { Plugin } from '@nestjs/apollo'
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base'

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  private logger = new Logger('GraphQL')

  async requestDidStart(context: GraphQLRequestContext): Promise<GraphQLRequestListener> {
    const startedAt = Date.now()
    const operation = context.request.operationName ? ` - "${context.request.operationName}"` : ''
    this.logger.log(`Incoming request${operation}`)
    if (context.request.operationName !== 'IntrospectionQuery') {
      this.logger.verbose({
        operation: context.request.operationName,
        query: context.request.query,
        variables: context.request.variables,
        extensions: context.request.extensions,
        lecture: context.request.http?.headers.get('x-lecture'),
      })
    }

    return {
      willSendResponse: async (context: GraphQLRequestContextWillSendResponse<BaseContext>) => {
        const duration = Date.now() - startedAt
        const status = context.response.errors?.length ? 'Error' : 'Success'
        this.logger.log(`Outgoing response - ${status}${operation} - ${duration}ms`)
        if (context.request.operationName !== 'IntrospectionQuery') {
          this.logger.verbose({
            operation: context.request.operationName,
            data: context.response.data,
            extensions: context.response.extensions,
            errors: context.response.errors,
          })
        }
      },
    }
  }
}
