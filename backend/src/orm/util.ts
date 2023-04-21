import { MikroORM } from '@mikro-orm/core'
import { ConsoleLogger } from '@nestjs/common'

const logger = new ConsoleLogger('MikroORM')

export async function ensureNoPendingMigrations(orm: MikroORM): Promise<boolean> {
  const pendingMigrations = await orm.getMigrator().getPendingMigrations()
  if (pendingMigrations.length === 0) return true

  const messagePrefix =
    pendingMigrations.length === 1
      ? 'There is 1 pending migration'
      : `There are ${pendingMigrations.length} pending migrations`
  const err = `${messagePrefix}: Run \`bin/mikro-orm migration:up\` to migrate up to the latest version`

  logger.error(err)
  return false
}
