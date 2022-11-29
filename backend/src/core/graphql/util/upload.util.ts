import { createWriteStream, readFileSync, rmSync } from 'fs'
import { v4 as uuid } from 'uuid'
import { startCase } from 'lodash'
import { FileUpload } from 'graphql-upload'
import { BadRequestException } from '@nestjs/common'

export interface UploadedFile {
  filename: string
  mimetype: string
  encoding: string
  buffer: Buffer
}

export type FileValidationOptions =
  | { acceptedMimeTypes: string[]; maxSize?: number; fieldname?: string; throwError?: boolean }
  | { acceptedMimeTypes?: string[]; maxSize: number; fieldname?: string; throwError?: boolean }

export async function parseUpload(
  upload: Promise<FileUpload>,
  validationOptions?: FileValidationOptions,
): Promise<UploadedFile> {
  const { filename, mimetype, encoding, createReadStream } = await upload
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(`${process.cwd()}/uploads/${uuid()}`)
    createReadStream()
      .pipe(writeStream)
      .on('finish', () => {
        const buffer = readFileSync(writeStream.path)
        rmSync(writeStream.path)
        const file: UploadedFile = { filename, mimetype, encoding, buffer }
        if (!validationOptions) return resolve(file)

        try {
          if (validateFile(file, validationOptions)) resolve(file)
          else reject(new Error(`File ${filename} could not be loaded`))
        } catch (err) {
          reject(err)
        }
      })
      .on('error', (error) => reject(error))
  })
}

export function parseUploads(
  uploads: Promise<FileUpload>[],
  validationOptions?: FileValidationOptions,
): Promise<UploadedFile[]> {
  return Promise.all(uploads.map((upload) => parseUpload(upload, validationOptions)))
}

const validateMimeType = (mimeType: string, acceptedMimeTypes: string[]) => {
  if (!acceptedMimeTypes.length) return true

  return acceptedMimeTypes.some((accepted) => {
    if (accepted.includes('*')) {
      const [type] = accepted.split('/')
      return mimeType.startsWith(`${type}/`)
    }
    return mimeType === accepted
  })
}

export function validateFile(file: UploadedFile, options: FileValidationOptions) {
  const { acceptedMimeTypes = [], maxSize = Infinity, fieldname = 'file', throwError = true } = options
  const { mimetype, buffer } = file
  const messages = [
    !validateMimeType(mimetype, acceptedMimeTypes) && `${startCase(fieldname)} is not a valid file type.`,
    buffer.byteLength > maxSize && `${startCase(fieldname)} is too large.`,
  ].filter(Boolean)

  if (throwError && messages.length) {
    throw new BadRequestException({
      statusCode: 400,
      message: messages,
      error: 'Bad Request',
    })
  }
  return messages.length === 0
}
