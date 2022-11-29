import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Lecture } from '../model'
import { LectureCreateInput, LectureUpdateInput } from '../graphql/type'
import { LECTURE_WAS_REMOVED, LECTURE_WAS_UPDATED, PARTICIPANT_JOINED } from '../graphql/subscription-events'
import { EntityRepository } from '~/orm'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { AppContext } from '~/core/types'
import { User } from '~/core/user/model'

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepository: EntityRepository<Lecture>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  async create(input: LectureCreateInput, ctx: AppContext<false>) {
    const lecture = this.lectureRepository.create({ ...input, owner: ctx.user, participants: [ctx.user] })
    await this.lectureRepository.flush()

    return lecture
  }

  async update(id: string, data: LectureUpdateInput, ctx: AppContext<false>) {
    const lecture = await this.lectureRepository.findOneOrFail({ id })
    lecture.assign({ ...data })
    await this.lectureRepository.flush()
    await this.pubSub.publish(LECTURE_WAS_UPDATED, {
      lectureWasUpdated: {
        lectureId: lecture.id,
        userId: ctx.user.id,
      },
    })

    return lecture
  }

  async delete(id: string, ctx: AppContext<false>) {
    const lecture = await this.lectureRepository.findOneOrFail({ id })
    this.lectureRepository.remove(lecture)
    await this.lectureRepository.flush()
    await this.pubSub.publish(LECTURE_WAS_REMOVED, {
      lectureWasRemoved: {
        lectureId: lecture.id,
        userId: ctx.user.id,
      },
    })
    return lecture
  }

  async verifyParticipation(lecture: Lecture, user: User) {
    await lecture.participants.init()
    if (lecture.participants.contains(user)) return lecture

    lecture.participants.add(user)
    await this.lectureRepository.flush()
    await this.pubSub.publish(PARTICIPANT_JOINED, {
      participantJoined: {
        lectureId: lecture.id,
        participantId: user.id,
      },
    })
    return lecture
  }
}
