import { Module } from '@nestjs/common'
import { S3Module } from 'nestjs-s3'
import { StorageController } from './controller'
import { StorageService } from './service'

@Module({
  imports: [
    S3Module.forRootAsync({
      useFactory: () => ({
        config: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_KEY,
          region: process.env.AWS_REGION,
          endpoint: process.env.AWS_S3_ENDPOINT,
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
