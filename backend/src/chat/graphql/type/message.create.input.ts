import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

@InputType()
export class MessageCreateInput {
  @IsNotEmpty()
  @Field(() => String)
  readonly text: string

  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly parentMessage?: string

  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly group?: string
}
