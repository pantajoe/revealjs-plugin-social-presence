import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useClient } from './use-client'
import { useNotifications } from './use-notifications'
import type {
  LoginInput,
  LoginMutation,
  LoginMutationVariables,
  LogoutMutation,
  LogoutMutationVariables,
  MeQuery,
  MeQueryVariables,
  UserFragment as User,
} from '~/graphql'
import { LoginDocument, LogoutDocument, MeDocument } from '~/graphql'
import { useCredentials } from '~/config/auth.config'

interface AuthContextState {
  user: User
  isLoggedIn: boolean
  loading: boolean
}

interface AuthContextActions {
  setUser: (user: User) => void
  login: (input: LoginInput) => Promise<User | null>
  logout: () => Promise<void>
  fetchUser: () => Promise<User | null>
}

type AuthContextValue = [AuthContextState, AuthContextActions]

const AuthContext = createContext<AuthContextValue | null>(null)

type Props = PropsWithChildren<Record<string, any>>

export const AuthProvider = ({ children }: Props) => {
  const { success } = useNotifications()

  const [user, setUser] = useState<User>(null as any)
  const { auth, setAuth, removeAuth } = useCredentials()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [, setInitialLoading] = useState(true)

  const { client, resetClient } = useClient()

  useEffect(() => {
    setIsLoggedIn(Boolean(auth?.token))
  }, [auth?.token])

  const login: AuthContextActions['login'] = useCallback(
    async ({ email, password }) => {
      setLoading(true)
      const { data, error } = await client
        .mutation<LoginMutation, LoginMutationVariables>(LoginDocument, {
          email,
          password,
        })
        .toPromise()

      if (!data || error) {
        setLoading(false)
        return null
      }

      const { user, accessToken: token, accessTokenExpiresAt: tokenExpiresAt } = data.login
      resetClient()
      setUser(user)
      setIsLoggedIn(true)
      setAuth({ token, tokenExpiresAt })
      setLoading(false)
      return user
    },
    [client, resetClient, setAuth],
  )

  const logout: AuthContextActions['logout'] = useCallback(async () => {
    await client.mutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, {}).toPromise()
    setUser(null as any)
    setIsLoggedIn(false)
    removeAuth()
    resetClient()
    success('You have been logged out successfully.')
  }, [client, removeAuth, resetClient, success])

  const fetchUser: AuthContextActions['fetchUser'] = useCallback(async () => {
    setLoading(true)
    const { data, error } = await client.query<MeQuery, MeQueryVariables>(MeDocument, {}).toPromise()
    if (!data || error) {
      setUser(null as any)
      setIsLoggedIn(false)
      removeAuth()
      setLoading(false)
      return null
    }

    const { me: user } = data
    setUser(user)
    setIsLoggedIn(true)
    setLoading(false)
    return user
  }, [client, removeAuth])

  useEffect(() => {
    fetchUser().then(() => setInitialLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value: AuthContextValue = useMemo(
    () => [
      {
        user,
        isLoggedIn: isLoggedIn && Boolean(user?.id),
        loading,
      },
      {
        setUser,
        login,
        logout,
        fetchUser,
      },
    ],
    [user, isLoggedIn, loading, login, fetchUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
