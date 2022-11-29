import { Collection, Entity, Enum, Index, ManyToMany, OneToMany, OptionalProps, Property } from '@mikro-orm/core'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { BaseEntity } from '~/orm'
import { getFileUrl } from '~/storage/utils'
import { Lecture } from '~/core/lecture/model'
import { Group, Message } from '~/chat/model'
import { Annotation, Comment } from '~/annotation/model'

export enum UserRole {
  Instructor = 'instructor',
  Student = 'student',
}

registerEnumType(UserRole, { name: 'UserRole' })

@Entity()
@ObjectType()
export class User extends BaseEntity<User> {
  [OptionalProps]?: 'role' | 'createdAt' | 'updatedAt' | 'avatarUrl' | 'isInstructor' | 'isStudent' | 'bio'

  @Field(() => String)
  @Index()
  @Property<User>({
    nullable: false,
    unique: true,
    onCreate: (user) => user.email.toLowerCase(),
    onUpdate: (user) => user.email.toLowerCase(),
  })
  email: string

  @Property({ nullable: false, hidden: true })
  password: string

  @Field(() => String)
  @Property({ nullable: false })
  name: string

  @Field(() => String)
  @Property({ type: 'text', nullable: false, default: '' })
  bio: string

  @Field(() => String)
  @Property({ nullable: false })
  profileColor: string

  @Property({ nullable: true, hidden: true, unique: true })
  refreshToken?: string

  @Property({ nullable: true, hidden: true })
  refreshTokenExpiresAt?: Date

  @Field(() => UserRole)
  @Enum(() => UserRole)
  @Property({ nullable: false, default: UserRole.Student })
  role: UserRole = UserRole.Student

  @Property({ nullable: true })
  avatar?: string

  @ManyToMany(() => Lecture, (lecture) => lecture.participants, { owner: true })
  lectures = new Collection<Lecture>(this)

  @OneToMany(() => Message, (message) => message.author)
  messages = new Collection<Message>(this)

  @ManyToMany(() => Group, (group) => group.users, { owner: true })
  groups = new Collection<Group>(this)

  @OneToMany(() => Annotation, (annotation) => annotation.author)
  annotations = new Collection<Annotation>(this)

  @OneToMany(() => Comment, (comment) => comment.author)
  comments = new Collection<Comment>(this)

  @Field(() => String, { nullable: true })
  get avatarUrl() {
    return getFileUrl(this.avatar)
  }

  @Field()
  get isInstructor(): boolean {
    return this.role === UserRole.Instructor
  }

  @Field()
  get isStudent(): boolean {
    return this.role === UserRole.Student
  }
}
