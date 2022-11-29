import { Collection, Entity, ManyToOne, OneToMany, OptionalProps, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { Comment } from './comment.entity'
import { Lecture } from '~/core/lecture/model'
import { User } from '~/core/user/model'
import { BaseEntity } from '~/orm'
import { Anything } from '~/core/graphql/scalar'

@Entity()
@ObjectType()
export class Annotation extends BaseEntity<Annotation> {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => String)
  @Property({ type: 'text', nullable: false })
  quote: string

  @Field(() => String)
  @Property({ type: 'text', nullable: false })
  text: string

  @Field(() => Anything)
  @Property({ type: 'json', nullable: false })
  target: Record<string, unknown>[]

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

  @OneToMany(() => Comment, (comment) => comment.annotation)
  comments = new Collection<Comment>(this)
}
