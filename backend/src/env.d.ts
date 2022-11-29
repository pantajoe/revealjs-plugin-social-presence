declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_USER: string
    ADMIN_PASSWORD: string
    AWS_S3_BUCKET: string
    AWS_S3_ENDPOINT: string
    AWS_REGION: string
    AWS_ACCESS_KEY_ID: string
    AWS_SECRET_KEY: string
    DATABASE_URL: string
    DOMAIN: string
    JWT_EXPIRATION_TIME: string
    NODE_ENV: 'development' | 'production' | 'staging' | 'test'
    REDIS_URL: string
    REFRESH_TOKEN_EXPIRATION_TIME: string
    SECRET_KEY_BASE: string
  }
}
