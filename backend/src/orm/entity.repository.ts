import {
  FilterQuery,
  FindOptions,
  EntityRepository as MikroOrmEntityRepository,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core'
import { BaseEntity } from './base.entity'
import {
  Connection,
  ConnectionArgs,
  generateConnection,
  getPagingParameters,
  isConnectionArgs,
} from '~/core/graphql/connection'

export class EntityRepository<T extends BaseEntity<T>> extends MikroOrmEntityRepository<T> {
  /**
   * Executes a query and returns the result a GraphQL Relay connection
   * given connection arguments.
   */
  paginate(connectionArgs: ConnectionArgs): Promise<Connection<T>>
  paginate(where: FilterQuery<T>, connectionArgs: ConnectionArgs): Promise<Connection<T>>
  paginate<P extends string = never>(
    where: FilterQuery<T>,
    findOptions: FindOptions<T, P>,
    connectionArgs: ConnectionArgs,
  ): Promise<Connection<T>>

  async paginate<P extends string = never>(
    whereOrConnectionArgs: FilterQuery<T> | ConnectionArgs,
    findOptionsOrConnectionArgs?: FindOptions<T, P> | ConnectionArgs,
    connectionArgs?: ConnectionArgs,
  ): Promise<Connection<T>> {
    let where = {} as FilterQuery<T>
    let findOptions: FindOptions<T, P> = {}
    let connectionArguments: ConnectionArgs = {}
    if (isConnectionArgs(whereOrConnectionArgs)) {
      connectionArguments = (whereOrConnectionArgs || {}) as ConnectionArgs
    } else if (isConnectionArgs(findOptionsOrConnectionArgs)) {
      where = (whereOrConnectionArgs || {}) as FilterQuery<T>
      connectionArguments = (findOptionsOrConnectionArgs || {}) as ConnectionArgs
    } else {
      where = (whereOrConnectionArgs || {}) as FilterQuery<T>
      findOptions = (findOptionsOrConnectionArgs || {}) as FindOptions<T, P>
      connectionArguments = (connectionArgs || {}) as ConnectionArgs
    }
    const { limit, offset } = getPagingParameters(connectionArguments)
    if (Object.keys(connectionArguments).length === 0) connectionArguments = { first: limit, after: undefined }

    const [entities, totalCount] = await this.findAndCount(where, {
      ...findOptions,
      limit,
      offset,
      orderBy: findOptions.orderBy ?? ({ updatedAt: QueryOrder.DESC } as QueryOrderMap<T>),
    })

    return generateConnection(entities, connectionArguments, { totalCount, offset })
  }
}
