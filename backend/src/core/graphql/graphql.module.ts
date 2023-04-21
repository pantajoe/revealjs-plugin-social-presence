import { Global, MiddlewareConsumer, Module, NestModule, OnModuleDestroy } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { graphqlUploadExpress } from 'graphql-upload'
import { Context } from 'graphql-ws'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/service'
import { User } from '../user/model'
import { LectureAccessService } from '../lecture/service'
import { LectureModule } from '../lecture/lecture.module'
import { LoggingPlugin, ServerErrorPlugin } from './plugin'
import { JsonObjectScalar, JsonScalar } from './scalar'
import { InjectPubSub, PUB_SUB_KEY, PubSub, PubSubFactory } from './subscription'
import { DataloaderModule } from './dataloader/dataloader.module'
import { Lecture } from '~/core/lecture/model'
import { buildCorsOptions } from '~/core/util'
import { isEnv } from '~/util'

export type GraphqlWsContext = Context<{ authToken?: string; lecture?: string }, { user: User; lecture: Lecture }>

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule, LectureModule],
      inject: [AuthService, LectureAccessService],
      useFactory: (authService: AuthService, lectureAccessService: LectureAccessService) => ({
        path: '/graphql',
        autoSchemaFile: 'schema.gql',
        sortSchema: true,
        autoTransformHttpErrors: true,
        debug: !isEnv('production'),
        playground: isEnv('development'),
        introspection: true,
        cors: buildCorsOptions({ methods: ['POST'] }),
        ...(process.env.APP_NAME === 'websocket'
          ? {}
          : {
              subscriptions: {
                'graphql-ws': {
                  path: '/graphql',
                  onConnect: async (context: GraphqlWsContext) => {
                    const { connectionParams, extra } = context
                    const { authToken, lecture: lectureSlug } = connectionParams ?? {}
                    if (!authToken || !lectureSlug) return false

                    const user = await authService.validateByToken(authToken)
                    if (!user) return false

                    const lecture = await lectureAccessService.findWsLecture(lectureSlug)
                    if (!lecture) return false

                    const hasAccess = await lectureAccessService.hasWsAccess({ user, lecture })
                    if (!hasAccess) return false

                    extra.user = user
                    extra.lecture = lecture

                    return true
                  },
                },
              },
            }),
        context: (context) => {
          if (context?.extra?.request) {
            return {
              req: {
                ...context?.extra?.request,
                ...context?.extra,
              },
            }
          }

          return { req: context?.req }
        },
        formatError: (error) => {
          if (error.extensions.code === '404') error.extensions.code = 'NOT_FOUND'
          if (error.extensions.code === '500') error.extensions.code = 'INTERNAL_SERVER_ERROR'
          return error
        },
      }),
    }),
    DataloaderModule,
  ],
  providers: [PubSubFactory(), JsonObjectScalar, JsonScalar, LoggingPlugin, ServerErrorPlugin],
  exports: [PUB_SUB_KEY],
})
export class GraphqlModule implements NestModule, OnModuleDestroy {
  @InjectPubSub() private readonly pubSub: PubSub

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }

  async onModuleDestroy() {
    try {
      await this.pubSub.getPublisher().quit()
      await this.pubSub.getSubscriber().quit()
    } catch (e) {}
  }
}
