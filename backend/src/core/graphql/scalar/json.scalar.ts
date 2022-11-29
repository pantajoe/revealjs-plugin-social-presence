import { CustomScalar, Scalar } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'

export class Anything {}

@Scalar('Json', () => Anything)
export class JsonScalar implements CustomScalar<any, any> {
  name = 'Json'
  description = 'Any type'

  serialize = GraphQLJSON.serialize
  parseValue = GraphQLJSON.parseValue
  parseLiteral = GraphQLJSON.parseLiteral
}
