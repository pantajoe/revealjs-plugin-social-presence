import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common'
import { HeadObjectOutput } from 'aws-sdk/clients/s3'
import { Response } from 'express'
import { InjectS3, S3 } from 'nestjs-s3'
import { Public } from '~/core/auth'

@Controller('storage/files')
export class StorageController {
  constructor(@InjectS3() private readonly s3: S3) {}

  @Public()
  @Get(':key(*)')
  async readFile(
    @Param('key') key: string,
    @Query('disposition') disposition: string | undefined,
    @Query('filename') filename: string | undefined,
    @Query('no_cache', new DefaultValuePipe(false), ParseBoolPipe) noCache: boolean,
    @Res({ passthrough: true }) res: Response,
  ) {
    const params = { Bucket: process.env.AWS_S3_BUCKET, Key: key }

    let meta: HeadObjectOutput
    try {
      meta = await this.s3.headObject(params).promise()
    } catch (e) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Requested key does not exist',
        error: 'Not Found',
      })
    }
    const file = this.s3.getObject(params).createReadStream()

    const contentDisposition =
      disposition === 'attachment' ? (filename ? `attachment; filename="${filename}"` : 'attachment') : 'inline'

    res.set({
      'Content-Length': meta.ContentLength,
      'Content-Type': meta.ContentType,
      'Content-Disposition': contentDisposition,
      'Cache-Control': noCache ? 'private, max-age=0, no-cache' : 'private, max-age=31536000, immutable',
    })

    return new StreamableFile(file)
  }
}
