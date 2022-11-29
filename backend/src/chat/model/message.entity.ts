import { Collection, Entity, ManyToOne, OneToMany, OptionalProps, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { Group } from './group.entity'
import { Lecture } from '~/core/lecture/model'
import { User } from '~/core/user/model'
import { BaseEntity } from '~/orm'

@Entity()
@ObjectType()
export class Message extends BaseEntity<Message> {
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

  @ManyToOne(() => Lecture, {
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  lecture: Lecture

  @ManyToOne(() => Group, {
    nullable: true,
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  group?: Group

  @ManyToOne(() => Message, {
    nullable: true,
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  parent?: Message

  @OneToMany(() => Message, (message) => message.parent)
  replies = new Collection<Message>(this)
}
