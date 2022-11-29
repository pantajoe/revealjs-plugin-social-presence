/// <reference types="vite/client" />
export {}

declare global {
  interface RevealOptions {
    audioStartAtFragment?: boolean
    audio?: {
      /** @default 'audio/'' */
      prefix?: string
      /** @default '.ogg' */
      suffix?: string
      /** @default null */
      textToSpeechURL?: string | null
      /** @default false */
      defaultNotes?: boolean
      /** @default false */
      defaultText?: boolean
      /** @default 0 */
      advance?: number
      /** @default false */
      autoplay?: boolean
      /** @default 5 */
      defaultDuration?: number
      /** @default true */
      defaultAudios?: boolean
      /** @default 0.05 */
      playerOpacity?: number
      /** @default 'position: fixed; bottom: 4px; left: 25%; width: 50%; height:75px; z-index: 33;' */
      playerStyle?: string
      /** @default false */
      startAtFragment?: boolean
    }
    coursemod?: {
      enabled?: boolean
      shown?: boolean
    }
    socialPresence?: {
      /** The URL of the social presence server. */
      apiUrl: string

      /** The URL of the socket.io social presence server. */
      socketUrl: string

      /**
       * Whether to enable a global chat.
       * 
       * @default true
       */
      chat?: boolean

      /**
       * Whether to enable breakout groups with chats.
       * 
       * @default true
       * */
      groups?: boolean

      /**
       * Whether to enable the visibility of other users' cursors.
       * 
       * @default true
       */
      cursors?: boolean

      /**
       * Whether to allow social annotations.
       * 
       * @default true
       */
      annotations?: boolean
    }
  }

  var toc_progress: {
    initialize: (mode?: string, color?: string, selector?: string) => void
    create: () => void
  }
  var prepareQuizzes: (opts: any) => void
  var RevealAudioSlideshow: any
  var RevealSocialPresence: {
    VERSION: string
    install: () => void
  }
}
