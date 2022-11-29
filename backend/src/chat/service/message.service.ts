import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'
import { MESSAGE_WAS_SENT } from '../graphql/subscription-events'
import { MessageConnectionArgs, MessageCreateInput } from '../graphql/type'
import { Message } from '../model'
import { Connection, InjectPubSub, PubSub, generateConnection, getPagingParameters } from '~/core/graphql'
import { AppContext } from '~/core/types'
import { EntityRepository } from '~/orm'

@Injectable()
export class MessageService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Message) private readonly messageRepository: EntityRepository<Message>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  async findAll(args: MessageConnectionArgs, ctx: AppContext): Promise<Connection<Message>> {
    const { offset, limit } = getPagingParameters(args)

    const query = this.em
      .createQueryBuilder(Message)
      .select('*')
      .where(args.group ? { group: args.group } : 'group_id IS NULL')
      .andWhere({ lecture: ctx.lecture.id })
      .orderBy({ createdAt: 'desc' })
      .limit(limit)
      .offset(offset)

    const totalCount = await query.getCount()
    const messages = await query.getResult()

    return generateConnection(messages, args, { totalCount, offset })
  }

  async create(input: MessageCreateInput, ctx: AppContext) {
    const message = this.messageRepository.create({
      text: input.text,
      parent: input.parentMessage,
      group: input.group,
      author: ctx.user,
      lecture: ctx.lecture,
    })
    await this.messageRepository.flush()
    await this.pubSub.publish(MESSAGE_WAS_SENT, {
      messageWasSent: {
        messageId: message.id,
        groupId: message.group?.id,
        userId: ctx.user.id,
        lectureId: ctx.lecture.id,
      },
    })
    return message
  }
}
