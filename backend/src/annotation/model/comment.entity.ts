import { Entity, ManyToOne, OptionalProps, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { Annotation } from './annotation.entity'
import { User } from '~/core/user/model'
import { BaseEntity } from '~/orm'

@Entity()
@ObjectType()
export class Comment extends BaseEntity<Comment> {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => String)
  @Property({ type: 'text', nullable: false })
  text: string

  @ManyToOne(() => User, {
    nullable: true,
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  author?: User

  @ManyToOne(() => Annotation, {
    nullable: false,
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  annotation: Annotation
}
