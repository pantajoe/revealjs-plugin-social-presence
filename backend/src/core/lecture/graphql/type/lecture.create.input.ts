import { Field, InputType } from '@nestjs/graphql'
import { LectureBaseInput } from './lecture.base.input'

@InputType()
export class LectureCreateInput extends LectureBaseInput {
  @Field(() => String)
  url: string
}
