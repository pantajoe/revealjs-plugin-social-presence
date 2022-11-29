export interface SocialPresenceConfig {
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
