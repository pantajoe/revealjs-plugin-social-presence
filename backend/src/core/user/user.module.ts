import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TokenModule } from '../token/token.module'
import { User } from './model'
import { UserPolicy } from './policy'
import { PasswordService, ProfileService } from './service'
import { ProfileResolver } from './graphql/resolver'
import { UserLoader } from './graphql/loader'
import { TeachersCommand, TeachersRegisterCommand } from './command'
import { StorageModule } from '~/storage/storage.module'

@Module({
  imports: [MikroOrmModule.forFeature([User]), StorageModule, TokenModule],
  providers: [
    ProfileService,
    PasswordService,
    PasswordService,
    UserPolicy,
    ProfileResolver,
    UserLoader,
    TeachersRegisterCommand,
    TeachersCommand,
  ],
  exports: [ProfileService, PasswordService, MikroOrmModule],
})
export class UserModule {}
