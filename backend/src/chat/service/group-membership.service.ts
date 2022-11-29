import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/knex'
import { Group } from '../model'
import { GROUP_MEMBER_JOINED, GROUP_MEMBER_LEFT } from '../graphql/subscription-events'
import { GroupService } from './group.service'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { AppContext } from '~/core/types'
import { EntityRepository } from '~/orm'

@Injectable()
export class GroupMembershipService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Group) private readonly groupRepository: EntityRepository<Group>,
    private readonly groupService: GroupService,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  async findAll(groupId: string) {
    const group = await this.groupRepository.findOneOrFail(groupId, { populate: ['users'] })
    return group.users.getItems()
  }

  async create(token: string, ctx: AppContext<false>) {
    const group = await this.groupRepository.findOneOrFail({ token }, { populate: ['users'] })
    group.users.add(ctx.user)
    await this.groupRepository.flush()
    await this.pubSub.publish(GROUP_MEMBER_JOINED, {
      groupMemberJoined: {
        groupId: group.id,
        userId: ctx.user.id,
        lectureId: group.lecture.id,
      },
    })
    return group
  }

  async delete(groupId: string, ctx: AppContext<false>) {
    const group = await this.groupRepository.findOneOrFail(groupId)
    const isOrphanedGroup = (await group.users.loadCount()) === 1
    if (isOrphanedGroup) {
      await this.groupService.delete(groupId)
    } else {
      await this.em.createQueryBuilder('user_groups').delete({ group_id: group.id, user_id: ctx.user.id }).execute()
      await this.pubSub.publish(GROUP_MEMBER_LEFT, {
        groupMemberLeft: {
          groupId: group.id,
          userId: ctx.user.id,
          lectureId: group.lecture.id,
        },
      })
    }
    return group
  }
}
