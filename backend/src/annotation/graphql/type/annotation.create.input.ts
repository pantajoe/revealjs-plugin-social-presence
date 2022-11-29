import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { Anything } from '~/core/graphql/scalar'

@InputType()
export class AnnotationCreateInput {
  @IsNotEmpty()
  @Field(() => String)
  text!: string

  @IsNotEmpty()
  @Field(() => String)
  quote!: string

  @Field(() => Anything)
  target: Record<string, unknown>[]
}
