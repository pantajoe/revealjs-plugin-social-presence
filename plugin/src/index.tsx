import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { createUrqlClient } from './config/urql.config'
import { AnnotationsProvider } from './hooks/use-annotations'
import { AuthProvider } from './hooks/use-auth'
import { ClientProvider } from './hooks/use-client'
import { ControlsProvider } from './hooks/use-controls'
import { GroupProvider } from './hooks/use-group'
import { GroupChatProvider } from './hooks/use-group-chat'
import { LectureProvider } from './hooks/use-lecture'
import { ChatProvider } from './hooks/use-messages'
import { NotificationContainer } from './hooks/use-notifications'
import { usePluginConfig } from './hooks/use-plugin-config'
import { PresenceProvider } from './hooks/use-presence'
import './styles.css'
import { composeProviders } from './utils'

const Providers = composeProviders(
  AuthProvider,
  LectureProvider,
  ControlsProvider,
  GroupProvider,
  PresenceProvider,
  ChatProvider,
  GroupChatProvider,
  AnnotationsProvider,
)

const validateConfig = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { apiUrl, socketUrl } = usePluginConfig()
  if (!apiUrl) {
    throw new Error(
      'Social Presence Plugin: No API URL provided. Please provide `socialPresence.apiUrl` in your reveal.js configuration.',
    )
  }
  if (!socketUrl) {
    throw new Error(
      'Social Presence Plugin: No Socket URL provided. Please provide `socialPresence.socketUrl` in your reveal.js configuration.',
    )
  }
  return true
}

const RevealSocialPresence = Object.freeze({
  VERSION: '__VERSION__',
  validateConfig,
  install: () => {
    validateConfig()

    const container = document.getElementById('social-presence')
    const root = createRoot(container!)
    root.render(
      <StrictMode>
        <ClientProvider makeClient={createUrqlClient}>
          <Providers>
            <App />
            <NotificationContainer />
          </Providers>
        </ClientProvider>
      </StrictMode>,
    )
  },
})

export default RevealSocialPresence
