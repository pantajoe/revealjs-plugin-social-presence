declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Email for the admin account of the admin panel
     * @default 'root@example.com'
     */
    ADMIN_USER: string

    /**
     * Password for the admin account of the admin panel
     * @default 'secret'
     */
    ADMIN_PASSWORD: string

    /**
     * The bucket name of the AWS S3 storage provider
     * @default 'content'
     */
    AWS_S3_BUCKET: string

    /**
     * The endpoint of the AWS S3 storage provider
     * @example 'https://s3.amazonaws.com'
     */
    AWS_S3_ENDPOINT: string

    /**
     * The region of the AWS S3 storage provider
     * @example 'eu-central-1'
     */
    AWS_REGION: string

    /**
     * The access key id for the AWS S3 storage provider
     */
    AWS_ACCESS_KEY_ID: string

    /**
     * The secret access key for the AWS S3 storage provider
     */
    AWS_SECRET_KEY: string

    /**
     * The URL of the PostgreSQL database
     * @example 'postgres://user:password@localhost:5432/database'
     */
    DATABASE_URL: string

    /**
     * The URL of the domain for the backend
     * @example 'social-presence.university.edu'
     */
    DOMAIN: string

    /**
     * The expiration time of the JWT token in a format readble by the `ms` package.
     * See https://www.npmjs.com/package/ms for more information.
     * @default '1m' // 1 minute
     */
    JWT_EXPIRATION_TIME: string

    /**
     * The environment in which the backend is running.
     * Should be 'production' once deployed.
     * @default 'development'
     */
    NODE_ENV: 'development' | 'production' | 'staging' | 'test'

    /**
     * The URL of the Redis database
     * @example 'redis://localhost:6379'
     */
    REDIS_URL: string

    /**
     * The expiration time of the refresh token in a format readble by the `ms` package.
     * See https://www.npmjs.com/package/ms for more information.
     * @default '0.25 year'
     */
    REFRESH_TOKEN_EXPIRATION_TIME: string

    /**
     * The secret key used to sign the JWT tokens.
     * Run `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
     * to generate one.
     */
    SECRET_KEY_BASE: string
  }
}
