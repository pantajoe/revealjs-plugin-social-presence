import { Module, forwardRef } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TokenModule } from '../token/token.module'
import { LectureAccessGuard } from '../lecture/guard'
import { LectureModule } from '../lecture/lecture.module'
import { AuthService, RefreshService } from './service'
import { AuthorizationGuard, JwtAuthGuard, OptionalAuthGuard, RefreshAuthGuard } from './guard'
import { JwtStrategy } from './strategy'
import { AuthResolver } from './graphql/resolver'
import { UserModule } from '~/core/user/user.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY_BASE,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    UserModule,
    TokenModule,
    forwardRef(() => LectureModule),
  ],
  providers: [
    AuthResolver,
    AuthService,
    RefreshService,
    JwtStrategy,
    RefreshAuthGuard,
    OptionalAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: LectureAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  exports: [AuthService, OptionalAuthGuard],
})
export class AuthModule {}
