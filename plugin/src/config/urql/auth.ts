import { authExchange } from '@urql/exchange-auth'
import { makeOperation } from 'urql'
import type { Auth } from '~/config/auth.config'
import { getAuth, removeAuth, setAuth } from '~/config/auth.config'
import type { RefreshLoginMutation, RefreshLoginMutationVariables } from '~/graphql'
import { RefreshLoginDocument } from '~/graphql'

type AuthState = Auth

const PUBLIC_MUTATIONS = ['login', 'joinLecture']

export interface CreateAuthExchangeOptions {
  onLogout?: () => void | Promise<void>
}

const createAuthExchange = (opts?: CreateAuthExchangeOptions) => {
  const { onLogout } = opts ?? {}

  return authExchange<AuthState>({
    getAuth: async ({ authState, mutate }) => {
      if (!authState) {
        const auth = getAuth()
        if (auth) return auth
        return null
      }

      const result = await mutate<RefreshLoginMutation, RefreshLoginMutationVariables>(RefreshLoginDocument)

      if (result.data?.refreshLogin) {
        const { accessToken: token, accessTokenExpiresAt } = result.data.refreshLogin
        // date is a string in ISO format as the customScalarsExchange is not executed here
        const tokenExpiresAt = new Date(accessTokenExpiresAt)
        const auth: Auth = { token, tokenExpiresAt }
        setAuth(auth)
        return auth
      }

      removeAuth()
      await onLogout?.()

      return null
    },
    addAuthToOperation: ({ operation, authState }) => {
      if (!authState) return operation

      const fetchOptions =
        typeof operation.context.fetchOptions === 'function'
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {}

      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: authState.token ? `Bearer ${authState.token}` : '',
          },
        },
      })
    },
    didAuthError: ({ error }) => {
      return error.graphQLErrors.some(({ extensions }) => extensions.code === 'UNAUTHENTICATED')
    },
    willAuthError: ({ authState, operation }) => {
      if (!authState) {
        // Detect our publi mutation and let these operations through:
        return !(
          operation.kind === 'mutation' &&
          operation.query.definitions.some((definition) => {
            return (
              definition.kind === 'OperationDefinition' &&
              definition.selectionSet.selections.some((node) => {
                return node.kind === 'Field' && PUBLIC_MUTATIONS.includes(node.name.value)
              })
            )
          })
        )
      } else if (new Date() > authState.tokenExpiresAt!) {
        return true
      }

      return false
    },
  })
}

export default createAuthExchange
