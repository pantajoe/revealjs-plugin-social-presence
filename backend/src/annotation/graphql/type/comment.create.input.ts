import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'

@InputType()
export class CommentCreateInput {
  @IsNotEmpty()
  @Field(() => String)
  text!: string

  @IsUUID()
  @Field(() => ID)
  annotation!: string
}
