import { createClient, dedupExchange, subscriptionExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { relayPagination } from '@urql/exchange-graphcache/extras'
import customScalarsExchange from 'urql-custom-scalars-exchange'
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch'
import { createClient as createWsClient } from 'graphql-ws'
import type { IntrospectionQuery } from 'graphql'
import schema from '../graphql/__generated__/schema.json'
import { usePluginConfig } from '../hooks/use-plugin-config'
import { getAuth } from './auth.config'
import authExchange from './urql/auth'
import { updateResolvers } from './urql/cache'

export interface CreateClientOptions {
  onLogout?: () => void | Promise<void>
  lecture?: string
}

export const createUrqlClient = (options: CreateClientOptions = {}) => {
  const baseURL = usePluginConfig().apiUrl
  const { onLogout, lecture } = options

  const wsClient = createWsClient({
    url: `${baseURL.replace(/^http/, 'ws')}/graphql`,
    connectionParams: () => {
      const { token } = getAuth() ?? {}
      return { authToken: token ?? '', lecture: lecture ?? '' }
    },
  })

  const url = `${baseURL}/graphql`
  const client = createClient({
    url,
    fetchOptions: {
      credentials: 'include',
      headers: {
        'x-lecture': lecture ?? '',
      },
    },
    exchanges: [
      dedupExchange,
      customScalarsExchange({
        schema: schema as any as IntrospectionQuery,
        scalars: {
          DateTime(value) {
            if (typeof value === 'string') return new Date(value)
            return null
          },
        },
      }),
      cacheExchange({
        resolvers: {
          Query: {
            messages: relayPagination(),
          },
        },
        updates: updateResolvers,
        schema: schema as any as IntrospectionQuery,
      }),
      authExchange({ onLogout }),
      multipartFetchExchange,
      subscriptionExchange({
        forwardSubscription: (operation) => ({
          subscribe: (sink) => ({
            unsubscribe: wsClient.subscribe(operation, sink),
          }),
        }),
      }),
    ],
  })

  return client
}
