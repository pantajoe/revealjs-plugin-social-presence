import { BadRequestException, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { LoginInput, TokenType } from '../type'
import { RefreshAuthGuard } from '../..'
import { CurrentUser, Public } from '~/core/auth/decorator'
import { AuthService, RefreshService } from '~/core/auth/service'
import { User } from '~/core/user/model'
import { SuccessType } from '~/core/graphql/type'
import { NoLecture } from '~/core/lecture'
import { isEnv } from '~/util'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly refreshService: RefreshService) {}

  @Public()
  @Mutation(() => TokenType, { nullable: false })
  async login(
    @Args('input', { type: () => LoginInput, nullable: false }) input: LoginInput,
    @Context('req') req: Request,
  ) {
    const { email, password } = input
    const user = await this.authService.validateUser(email, password)

    if (!user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid credentials',
        error: 'Bad Request',
      })
    }

    const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt } = await this.authService.login(
      user,
    )
    req.user = user
    req.res!.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isEnv('production', 'staging'),
      expires: refreshTokenExpiresAt,
      domain: process.env.DOMAIN.split(':')[0],
      sameSite: 'lax',
    })
    return { accessToken, accessTokenExpiresAt, user }
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Mutation(() => TokenType, { nullable: false })
  async refreshLogin(@CurrentUser() user: User, @Context('req') req: Request) {
    const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt } = await this.authService.login(
      user,
    )
    req.user = user
    req.res!.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isEnv('production', 'staging'),
      expires: refreshTokenExpiresAt,
      domain: process.env.DOMAIN.split(':')[0],
      sameSite: 'lax',
    })
    return { accessToken, accessTokenExpiresAt, user }
  }

  @NoLecture()
  @Mutation(() => SuccessType, { nullable: false })
  async logout(@CurrentUser() user: User, @Context('req') req: Request) {
    await this.refreshService.removeRefreshToken(user)
    req.res!.clearCookie('refreshToken')

    if (!user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid credentials',
        error: 'Bad Request',
      })
    }

    return { success: true }
  }
}
