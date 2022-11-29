import { InputType } from '@nestjs/graphql'
import { GroupBaseInput } from './group.base.input'

@InputType()
export class GroupCreateInput extends GroupBaseInput {}
