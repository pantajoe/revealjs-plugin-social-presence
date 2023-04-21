import { ConsoleLogger, NotFoundException } from '@nestjs/common'
import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { EntityRepository } from './src/orm'
import { isEnv } from './src/util'

const logger = new ConsoleLogger('MikroORM')

export const LECTURE_FILTER_KEY = 'lecture'

const driverOptions =
  isEnv('production', 'staging') && process.env.DISABLE_MIKRO_ORM_SSL !== 'true'
    ? {
        connection: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {}

const config = {
  allowGlobalContext: process.env.REPL === 'true' || isEnv('test'),
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  driverOptions,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  highlighter: new SqlHighlighter(),
  migrations: {
    tableName: '_migrations',
    path: 'dist/db/migrations',
    pathTs: 'db/migrations',
    emit: 'ts',
    allOrNothing: true,
    disableForeignKeys: false,
  },
  seeder: {
    path: 'dist/db/seeders',
    pathTs: 'db/seeders',
    emit: 'ts',
    defaultSeeder: 'DatabaseSeeder',
  },
  logger:
    process.env.DISABLE_MIKRO_ORM_LOGS === 'true' || process.env.REPL || process.env.CLI
      ? (_message: string) => {}
      : logger.debug.bind(logger),
  persistOnCreate: true,
  forceUtcTimezone: true,
  entityRepository: EntityRepository,
  validateRequired: true,
  findOneOrFailHandler: (entityName, _where) => {
    return new NotFoundException({
      statusCode: 404,
      message: `Requested ${entityName} does not exist`,
      error: 'Not Found',
    })
  },
  filters: {
    [LECTURE_FILTER_KEY]: {
      cond: (args) => ({ lecture: args.lecture }),
      default: true,
      entity: ['Message', 'Annotation'],
    },
  },
} as Options

export default config
