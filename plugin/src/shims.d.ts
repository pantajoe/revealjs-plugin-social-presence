import type { SocialPresenceConfig } from './types'

export {}

declare module '*.css' {}

declare global {
  interface RevealOptions {
    socialPresence: SocialPresenceConfig
  }

  interface RevealStatic {
    getIndices(): {
      h: number
      v: number
      f?: number
    }
    getSlides(): HTMLElement[]
    isReady(): boolean
  }
}
