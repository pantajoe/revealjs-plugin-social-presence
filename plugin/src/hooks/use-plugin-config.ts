import type { SocialPresenceConfig } from '~/types'

export const usePluginConfig = (): Required<SocialPresenceConfig> => {
  const config = Reveal.getConfig().socialPresence ?? {}
  return {
    ...config,
    annotations: config.annotations ?? true,
    chat: config.chat ?? true,
    cursors: config.cursors ?? true,
    groups: config.groups ?? true,
  }
}
