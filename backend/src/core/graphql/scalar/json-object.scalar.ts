import { CustomScalar, Scalar } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@Scalar('JsonObject', () => Object)
export class JsonObjectScalar implements CustomScalar<string, any> {
  name = GraphQLJSONObject.name
  description = GraphQLJSONObject.description!

  serialize = GraphQLJSONObject.serialize
  parseValue = GraphQLJSONObject.parseValue
  parseLiteral = GraphQLJSONObject.parseLiteral
}
