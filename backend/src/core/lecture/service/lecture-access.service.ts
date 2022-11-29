import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Lecture } from '../model'
import { EntityRepository } from '~/orm'
import { User } from '~/core/user/model'

@Injectable()
export class LectureAccessService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Lecture) private readonly lectureRepository: EntityRepository<Lecture>,
  ) {}

  @UseRequestContext()
  findWsLecture(id: string) {
    return this.lectureRepository.findOne({ id })
  }

  findLecture(id: string) {
    return this.lectureRepository.findOne({ id })
  }

  async hasAccess({ user, lecture }: { lecture: Lecture; user: User }) {
    const isOwner = user.id === lecture.owner.id
    if (isOwner) return true

    const participants = await lecture.participants.init()
    return participants.getItems().some((participant) => participant.id === user.id)
  }

  @UseRequestContext()
  async hasWsAccess({ user, lecture }: { lecture: Lecture; user: User }) {
    const isOwner = user.id === lecture.owner.id
    if (isOwner) return true

    const participants = await lecture.participants.init()
    return participants.getItems().some((participant) => participant.id === user.id)
  }
}
