import { InputType, PartialType } from '@nestjs/graphql'
import { GroupBaseInput } from './group.base.input'

@InputType()
export class GroupUpdateInput extends PartialType(GroupBaseInput) {}
