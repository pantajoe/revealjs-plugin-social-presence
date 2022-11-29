import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { GroupCreateInput, GroupUpdateInput } from '../graphql/type'
import { Group } from '../model'
import { GROUP_WAS_UPDATED } from '../graphql/subscription-events'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { AppContext } from '~/core/types'
import { EntityRepository } from '~/orm'

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly groupRepository: EntityRepository<Group>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  async create(input: GroupCreateInput, ctx: AppContext) {
    const token = await this.generateToken()
    const group = this.groupRepository.create({ token, name: input.name, lecture: ctx.lecture, users: [ctx.user] })
    await this.groupRepository.flush()
    return group
  }

  async findOne({ user, lecture }: AppContext) {
    return this.groupRepository.findOneOrFail({ lecture, users: { id: user.id } })
  }

  async delete(id: string) {
    const group = await this.groupRepository.findOneOrFail(id)
    this.groupRepository.removeAndFlush(group)
  }

  async update(id: string, input: GroupUpdateInput, ctx: AppContext) {
    const group = await this.groupRepository.findOneOrFail(id)
    group.assign(input)
    await this.groupRepository.flush()
    await this.pubSub.publish(GROUP_WAS_UPDATED, {
      groupWasUpdated: {
        groupId: group.id,
        userId: ctx.user.id,
        lectureId: ctx.lecture.id,
      },
    })
    return group
  }

  /**
   * Generates a unique token for a group.
   * A token consists of 6 characters.
   * Eligible characters are capital letters and numbers.
   */
  private async generateToken(): Promise<string> {
    const token = Math.random().toString(36).slice(2, 8).toUpperCase()
    const group = await this.groupRepository.findOne({ token })
    if (group) {
      return this.generateToken()
    }
    return token
  }
}
