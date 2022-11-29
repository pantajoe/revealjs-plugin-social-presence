import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import ms from 'ms'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'
import { RefreshService } from './refresh.service'
import { User } from '~/core/user/model'
import { ProfileService } from '~/core/user/service'
import { EntityRepository } from '~/orm'

export interface AuthPayload {
  accessToken: string
  accessTokenExpiresAt: Date
  refreshToken: string
  refreshTokenExpiresAt: Date
  user: User
}

@Injectable()
export class AuthService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private profileService: ProfileService,
    private refreshService: RefreshService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Nullable<User>> {
    const user = await this.profileService.findOne({ email: email.toLowerCase() })
    if (!user) return null

    return bcrypt.compareSync(password, user.password) ? user : null
  }

  @UseRequestContext()
  async validateByToken(token: string) {
    if (!token) return null

    let payload: JwtPayload
    try {
      payload = await this.jwtService.verifyAsync(token)
    } catch (err) {
      return null
    }
    const user = await this.userRepository.findOne({ id: typeof payload === 'string' ? payload : payload.sub })
    if (!user) return null
    return user
  }

  async validateUserByToken(token: string) {
    if (!token) return null

    let payload: JwtPayload
    try {
      payload = await this.jwtService.verifyAsync(token)
    } catch (err) {
      return null
    }
    const user = await this.userRepository.findOne({ id: typeof payload === 'string' ? payload : payload.sub })
    if (!user) return null
    return user
  }

  async login(user: User): Promise<AuthPayload> {
    const payload = { email: user.email, sub: user.id }
    const accessTokenExpiresAt = new Date(Date.now() + ms(process.env.JWT_EXPIRATION_TIME))
    const { refreshToken, refreshTokenExpiresAt } = await this.refreshService.generateRefreshToken(user)

    return {
      accessToken: this.jwtService.sign(payload),
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      user,
    }
  }
}
