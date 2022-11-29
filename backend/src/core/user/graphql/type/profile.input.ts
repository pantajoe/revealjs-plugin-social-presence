import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { UserBaseInput } from './user.base.input'

@InputType()
export class ProfileInput extends PartialType(OmitType(UserBaseInput, ['email'])) {
  @Field(() => GraphQLUpload, { nullable: true })
  readonly avatar?: Promise<FileUpload>

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  readonly deleteAvatar: boolean = false
}
