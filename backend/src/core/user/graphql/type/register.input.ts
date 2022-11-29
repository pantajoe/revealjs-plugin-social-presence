import { Field, InputType } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { UserBaseInput } from './user.base.input'

@InputType()
export class RegisterInput extends UserBaseInput {
  @Field(() => GraphQLUpload, { nullable: true })
  readonly avatar?: Promise<FileUpload>

  @Field(() => String)
  readonly password: string
}
