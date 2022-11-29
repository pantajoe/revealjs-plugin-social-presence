import { useCallback, useMemo } from 'react'
import { useLocalStorageValue } from '@react-hookz/web'
import { parseJson } from '~/utils'
import { useRefreshLoginMutation } from '~/graphql'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_TOKEN_EXPIRES_AT_KEY = 'auth_token_expires_at'

export interface Auth {
  token: string
  tokenExpiresAt: Date
}

export const getAuth = (): Auth | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const tokenExpiresAt = localStorage.getItem(AUTH_TOKEN_EXPIRES_AT_KEY)

  if (!token) return null

  return {
    token: parseJson(token, token),
    tokenExpiresAt: new Date(parseJson(tokenExpiresAt!, tokenExpiresAt!)),
  }
}

export const setAuth = ({ token, tokenExpiresAt }: Auth) => {
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token))
  localStorage.setItem(AUTH_TOKEN_EXPIRES_AT_KEY, JSON.stringify(tokenExpiresAt.toISOString()))
}

export const removeAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY)
}

export const useCredentials = () => {
  const tokenStore = useLocalStorageValue<string>(AUTH_TOKEN_KEY, {
    initializeWithValue: true,
  })
  const tokenExpiriationStore = useLocalStorageValue<string>(AUTH_TOKEN_EXPIRES_AT_KEY, {
    initializeWithValue: true,
  })

  const setAuth = useCallback(
    ({ token, tokenExpiresAt }: Auth) => {
      tokenStore.set(token)
      tokenExpiriationStore.set(tokenExpiresAt.toISOString())
    },
    [tokenStore, tokenExpiriationStore],
  )

  const removeAuth = useCallback(() => {
    tokenStore.remove()
    tokenExpiriationStore.remove()
  }, [tokenStore, tokenExpiriationStore])
  const refetchAuth = useCallback(() => {
    tokenStore.fetch()
    tokenExpiriationStore.fetch()
  }, [tokenStore, tokenExpiriationStore])

  const auth: Auth | null = useMemo(
    () =>
      tokenStore.value && tokenExpiriationStore.value
        ? { token: tokenStore.value, tokenExpiresAt: new Date(tokenExpiriationStore.value) }
        : null,
    [tokenStore.value, tokenExpiriationStore.value],
  )

  const [, refreshMutation] = useRefreshLoginMutation()
  const refresh = useCallback(async () => {
    if (!auth?.tokenExpiresAt || new Date() < auth.tokenExpiresAt) return

    const { data } = await refreshMutation({})
    if (!data) return
    const { accessToken: newToken, accessTokenExpiresAt: newExpiration } = data.refreshLogin
    const newAuth: Auth = { token: newToken, tokenExpiresAt: newExpiration }
    setAuth(newAuth)
  }, [auth, setAuth, refreshMutation])

  return {
    auth,
    refresh,
    setAuth,
    removeAuth,
    refetchAuth,
  }
}
