import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { PARTICIPANT_JOINED, PARTICIPANT_LEFT } from '../graphql/subscription-events'
import { Lecture } from '../model'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { User } from '~/core/user/model'
import { EntityRepository } from '~/orm'
import { AppContext } from '~/core/types'

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepository: EntityRepository<Lecture>,
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  async joinLecture(args: { lectureId: string; url: string }, user: User) {
    const { lectureId: id, url } = args
    const lecture = await this.lectureRepository.findOneOrFail({ id, url }, { populate: ['participants'] })
    if (lecture.participants.contains(user)) return lecture

    lecture.participants.add(user)
    await this.lectureRepository.flush()
    await this.pubSub.publish(PARTICIPANT_JOINED, {
      participantJoined: {
        lectureId: lecture.id,
        userId: user.id,
        participantId: user.id,
      },
    })
    return lecture
  }

  async leaveLecture(lectureId: string, user: User) {
    await user.lectures.init()
    const lecture = this.lectureRepository.getReference(lectureId)
    if (user.lectures.contains(lecture)) user.lectures.remove(lecture)
    await this.userRepository.flush()
    await this.pubSub.publish(PARTICIPANT_LEFT, {
      participantLeft: {
        lectureId: lecture.id,
        userId: user.id,
        participantId: user.id,
      },
    })
    return lecture
  }

  async kickParticipant(lectureId: string, participantId: string, ctx: AppContext<false>) {
    const participant = await this.userRepository.findOneOrFail(participantId, { populate: ['lectures'] })
    const lecture = this.lectureRepository.getReference(lectureId)
    if (participant.lectures.contains(lecture)) participant.lectures.remove(lecture)
    await this.userRepository.flush()
    await this.pubSub.publish(PARTICIPANT_LEFT, {
      participantLeft: {
        lectureId: lecture.id,
        userId: ctx.user.id,
        participantId,
      },
    })
    return lecture
  }
}
