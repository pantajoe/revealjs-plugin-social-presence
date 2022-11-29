import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import ms from 'ms'
import { TokenService } from '~/core/token/service'
import { User } from '~/core/user/model'
import { EntityRepository } from '~/orm'

@Injectable()
export class RefreshService {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
  ) {}

  async generateRefreshToken(user: User) {
    const { token: refreshToken, digest } = this.tokenService.generatePair()
    const refreshTokenExpiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRATION_TIME))
    user.assign({
      refreshToken: digest,
      refreshTokenExpiresAt,
    })
    await this.userRepository.flush()
    return { refreshToken, refreshTokenExpiresAt }
  }

  async removeRefreshToken(user: User) {
    user.refreshToken = null as any
    user.refreshTokenExpiresAt = null as any
    await this.userRepository.flush()
  }
}
