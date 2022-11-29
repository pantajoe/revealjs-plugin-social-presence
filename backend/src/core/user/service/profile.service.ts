import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable } from '@nestjs/common'
import { FilterQuery } from '@mikro-orm/core'
import { FileUpload } from 'graphql-upload'
import { User } from '../model'
import { ProfileInput, RegisterInput } from '../graphql/type'
import { USER_WAS_REMOVED, USER_WAS_UPDATED } from '../graphql/subscription-events'
import { PasswordService } from './password.service'
import { EntityRepository } from '~/orm'
import { StorageService } from '~/storage/service'
import { InjectPubSub, PubSub, parseUpload } from '~/core/graphql'

interface ProfileUpdateParams {
  user: User
  updateData: ProfileInput
}

@Injectable()
export class ProfileService {
  static readonly MaxAvatarSize = 5 * 1024 * 1024

  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    private readonly storageService: StorageService,
    private readonly passwordService: PasswordService,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  async findOne(where: FilterQuery<User>) {
    const user = await this.userRepository.findOne(where, { filters: false })
    if (!user) return null

    return user
  }

  async register(input: RegisterInput) {
    const { email, avatar, color: profileColor, password, ...rest } = input
    if (await this.userRepository.findOne({ email })) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'The email address you have entered is already associated with another account.',
        error: 'Bad Request',
      })
    }

    const user = this.userRepository.create({
      email,
      profileColor,
      password: this.passwordService.hashPassword(password),
      ...rest,
    })

    if (avatar) await this.attachAvatar(user, avatar)
    await this.userRepository.flush()

    return user
  }

  async update({ user, updateData }: ProfileUpdateParams) {
    const { name, deleteAvatar, avatar, bio, color: profileColor } = updateData
    const { avatar: oldImage } = user
    user.assign({ name, bio, profileColor })
    if (avatar) {
      await this.attachAvatar(user, avatar)
    } else if (deleteAvatar && oldImage) {
      await this.storageService.deleteFile(oldImage)
      user.avatar = null as any
    }
    await this.userRepository.flush()
    await user.lectures.init()
    await this.pubSub.publish(USER_WAS_UPDATED, {
      userWasUpdated: {
        userId: user.id,
        lectureIds: user.lectures.getIdentifiers<string>(),
      },
    })
    return user
  }

  async delete(user: User) {
    if (user.avatar) await this.storageService.deleteFile(user.avatar)
    await user.lectures.init()
    const lectureIds = user.lectures.getIdentifiers<string>()
    await this.userRepository.removeAndFlush(user)
    await this.pubSub.publish(USER_WAS_REMOVED, {
      userWasRemoved: {
        userId: user.id,
        lectureIds,
      },
    })
  }

  private async attachAvatar(user: User, avatar: Promise<FileUpload>) {
    const uploadedFile = await parseUpload(avatar, {
      fieldname: 'avatar',
      maxSize: ProfileService.MaxAvatarSize,
      acceptedMimeTypes: ['image/jpeg', 'image/png'],
    })
    const { buffer, filename: originalFileName, mimetype: mimeType } = uploadedFile
    const { assetKey } = await this.storageService.uploadFile({
      file: buffer,
      mimeType,
      originalFileName,
      prefix: 'avatars/',
    })
    user.avatar = assetKey
  }
}
