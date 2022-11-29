import { InputType, PartialType } from '@nestjs/graphql'
import { LectureBaseInput } from './lecture.base.input'

@InputType()
export class LectureUpdateInput extends PartialType(LectureBaseInput) {}
