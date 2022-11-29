import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Client } from 'urql'
import { Provider as UrqlProvider } from 'urql'
import { useNotifications } from './use-notifications'
import type { CreateClientOptions } from '~/config/urql.config'
import { useCredentials } from '~/config/auth.config'

export interface ClientState {
  client: Client
  resetClient: (args?: { lecture?: string | undefined }) => void
}

const ClientContext = createContext<ClientState | null>(null)

type Props = PropsWithChildren<{
  makeClient: (options?: CreateClientOptions) => Client
}>

export function ClientProvider({ children, makeClient }: Props) {
  const { removeAuth } = useCredentials()
  const { error } = useNotifications()
  const onLogout = useCallback(() => {
    removeAuth()
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setClient(makeClient({ onLogout }))
    error('You have been logged out for security reasons. Please sign back in to continue.')
  }, [makeClient, removeAuth, error])
  const [client, setClient] = useState<Client>(makeClient({ onLogout }))

  const resetClient: ClientState['resetClient'] = useCallback(
    ({ lecture } = {}) => {
      setClient(makeClient({ onLogout, lecture }))
    },
    [makeClient, onLogout],
  )

  const value: ClientState = useMemo(() => ({ client, resetClient }), [client, resetClient])

  return (
    <ClientContext.Provider value={value}>
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </ClientContext.Provider>
  )
}

export const useClient = () => {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }
  return context
}
