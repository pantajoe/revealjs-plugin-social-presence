import { Module } from '@nestjs/common'
import { TokenService } from './service'

@Module({
  imports: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
