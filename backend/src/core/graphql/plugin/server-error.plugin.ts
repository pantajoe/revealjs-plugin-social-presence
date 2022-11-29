import { Plugin } from '@nestjs/apollo'
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base'

@Plugin()
export class ServerErrorPlugin implements ApolloServerPlugin {
  async requestDidStart(_context: GraphQLRequestContext): Promise<GraphQLRequestListener> {
    return {
      willSendResponse: async (context: GraphQLRequestContextWillSendResponse<BaseContext>) => {
        const hasServerError = context.response.errors?.some(
          (error) => error.extensions?.code === 'INTERNAL_SERVER_ERROR',
        )
        if (hasServerError && context.response.http) {
          context.response.http.status = 500
        }
      },
    }
  }
}
