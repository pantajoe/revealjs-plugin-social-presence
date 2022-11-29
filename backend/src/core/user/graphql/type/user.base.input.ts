import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsHexColor } from 'class-validator'
import { LowerCase, Trim } from '~/core/transformer'

@InputType({ isAbstract: true })
export class UserBaseInput {
  @IsEmail()
  @LowerCase()
  @Trim()
  @Field(() => String)
  readonly email: string

  @Trim()
  @Field(() => String)
  readonly name: string

  @Field(() => String, { nullable: true })
  readonly bio?: string

  @IsHexColor()
  @Field(() => String)
  readonly color: string
}
