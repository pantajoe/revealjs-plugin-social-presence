import { Collection, Entity, Index, ManyToMany, ManyToOne, OneToMany, OptionalProps, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from '~/orm'
import { User } from '~/core/user/model'
import { Message } from '~/chat/model'
import { Annotation } from '~/annotation/model'

@Entity()
@ObjectType()
export class Lecture extends BaseEntity<Lecture> {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => String)
  @Index()
  @Property({ nullable: false })
  name: string

  @Field(() => String)
  @Property({ nullable: false })
  url: string

  @ManyToOne(() => User, {
    nullable: false,
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    serializer: (o) => (o ? { id: o.id } : null),
  })
  owner: User

  @ManyToMany(() => User, (user) => user.lectures)
  participants = new Collection<User>(this)

  @OneToMany(() => Message, (message) => message.lecture)
  messages = new Collection<Message>(this)

  @OneToMany(() => Annotation, (annotation) => annotation.lecture)
  annotations = new Collection<Annotation>(this)
}
