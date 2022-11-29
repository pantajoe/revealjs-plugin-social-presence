import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import mikroOrmConfig from '@/mikro-orm.config'

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig)],
})
export class OrmModule {}
