import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OptionalProps, Property, Unique } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { Message } from './message.entity'
import { Lecture } from '~/core/lecture/model'
import { User } from '~/core/user/model'
import { BaseEntity } from '~/orm'

@Entity()
@Unique<Group>({ properties: ['token', 'lecture'] })
@ObjectType()
export class Group extends BaseEntity<Group> {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => String)
  @Property({ nullable: false })
  name: string

  @Field(() => String)
  @Property({ nullable: false })
  token: string

  @ManyToOne(() => Lecture, {
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  lecture: Lecture

  @OneToMany(() => Message, (message) => message.group)
  messages = new Collection<Message>(this)

  @ManyToMany(() => User, (user) => user.groups)
  users = new Collection<User>(this)
}
