import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import * as Relay from 'graphql-relay'
import { PageInfo } from './page-info.type'

export type Edge<T> = Relay.Edge<T>

export interface Connection<T> extends Relay.Connection<T> {
  nodes: T[]
  totalCount: number
}

export function ConnectionType<T>(name: string, classRef: () => Type<T>): Type<Connection<T>> {
  @ObjectType(`${name}Edge`)
  abstract class EdgeType implements Edge<T> {
    @Field(classRef)
    node: T

    @Field(() => String)
    cursor: Relay.ConnectionCursor
  }

  @ObjectType({ isAbstract: true })
  class IConnection implements Connection<T> {
    @Field(() => [EdgeType])
    edges: EdgeType[]

    @Field(() => [classRef()])
    nodes: T[]

    @Field(() => PageInfo)
    pageInfo: Relay.PageInfo

    @Field(() => Int)
    totalCount: number
  }

  return IConnection
}
