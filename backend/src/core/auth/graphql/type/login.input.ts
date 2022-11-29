import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { LowerCase } from '~/core/transformer'

@InputType()
export class LoginInput {
  @IsEmail()
  @LowerCase()
  @Field(() => String, { nullable: false })
  email: string

  @Field(() => String, { nullable: false })
  password: string
}
