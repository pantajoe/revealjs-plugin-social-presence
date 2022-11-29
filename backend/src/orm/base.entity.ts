import {
  AssignOptions,
  Entity,
  EntityData,
  BaseEntity as MikroOrmBaseEntity,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core'
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { v4 as uuidv4 } from 'uuid'
import { isUndefined, omitBy } from 'lodash'

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
export abstract class BaseEntity<T extends { id: string }> extends MikroOrmBaseEntity<T, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: UuidType, columnType: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string = uuidv4()

  @Field(() => GraphQLISODateTime)
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date()

  @Field(() => GraphQLISODateTime)
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(data?: Partial<EntityData<T>>) {
    super()
    Object.assign(this, data)
  }

  /**
   * Updates the `updatedAt` timestamp of the entity.
   */
  touch(): void {
    this.updatedAt = new Date()
  }

  assign(data: EntityData<T>, options?: AssignOptions): T {
    return super.assign(omitBy(data, isUndefined) as EntityData<T>, options)
  }

  /**
   * Stringifies the entity to a String containing entity name and id,
   * separated by a colon.
   *
   * @example 'User:1234'
   */
  toGlobalId(): string {
    return `${this.constructor.name}:${this.id}`
  }
}
