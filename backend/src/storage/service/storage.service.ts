import { Injectable } from '@nestjs/common'
import { InjectS3, S3 } from 'nestjs-s3'
import { extension } from 'mime-types'
import { v4 as uuid } from 'uuid'
import { sanitizeFileName } from '../utils'

export type StoragePrefix = `${string}/`

export interface UploadFileParams {
  prefix?: StoragePrefix
  file: Buffer
  mimeType: string
  originalFileName: string
  uniqueFileName?: string
}

@Injectable()
export class StorageService {
  constructor(@InjectS3() private readonly s3: S3) {}

  generateUniqueFileName({ fileName, mimeType }: { fileName: string; mimeType: string }) {
    const fileExtension = extension(mimeType) || 'bin'
    const fileNameWithoutExtension = fileName.replace(/\.[A-z]+$/, '')
    const sanitizedFileName = sanitizeFileName(fileNameWithoutExtension)
    const fileNameWithExtension = `${sanitizedFileName}.${fileExtension}`
    return `${uuid()}-${fileNameWithExtension}`
  }

  async uploadFile(uploadFileParams: UploadFileParams) {
    const { prefix } = uploadFileParams
    const { binary, mimeType, uniqueFileName } = this.getFileData(uploadFileParams)

    const key = `${prefix || ''}${uniqueFileName}`
    const { Location: assetUrl, Key: assetKey } = await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Body: binary,
        Key: key,
        ContentType: mimeType,
        CacheControl: 'no-cache',
        ContentDisposition: 'inline',
      })
      .promise()

    return {
      assetUrl,
      assetKey,
    }
  }

  async copyFile({ sourceKey, targetKey }: { sourceKey: string; targetKey: string }) {
    try {
      const copyResponse = await this.s3
        .copyObject({
          Bucket: process.env.AWS_S3_BUCKET,
          CopySource: `/${process.env.AWS_S3_BUCKET}/${sourceKey}`,
          Key: targetKey,
        })
        .promise()

      return copyResponse
    } catch (err) {}
  }

  async deleteFile(key: string) {
    await this.s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET, Key: key }).promise()
  }

  private getFileData(uploadFileParams: UploadFileParams) {
    const { mimeType, file: binary, originalFileName } = uploadFileParams

    const uniqueFileName =
      uploadFileParams.uniqueFileName ||
      this.generateUniqueFileName({
        fileName: originalFileName,
        mimeType,
      })

    return {
      binary,
      mimeType,
      size: Buffer.byteLength(binary),
      originalFileName,
      uniqueFileName,
    }
  }
}
