import { extension } from 'mime-types'

export const sanitizeFileName = (fileName: string) => {
  if (!fileName) return ''

  return fileName
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '') // remove diacritics (accents, umlauts, ...)
    .replace(/\s/g, '_') // replace whitespace with underscore
    .replace(/[\u00DF]/g, 'ss') // replace ß with ss
    .replace(/[\u00E6]/g, 'ae') // replace æ with ae
    .replace(/[\u00C6]/g, 'Ae') // replace Æ with Ae
    .replace(/[\u00F8]/g, 'o') // replace ø with o
    .replace(/[\u00D8]/g, 'O') // replace Ø with O
    .replace(/[\u0153]/g, 'oe') // replace œ with oe
    .replace(/[\u0152]/g, 'Oe') // replace Œ with Oe
    .replace(/[\u0142]/g, 'l') // replace ł with l
    .replace(/[\u0141]/g, 'L') // replace Ł with L
    .replace(/[^a-z0-9-.]/gi, '-') // replace all non-alphanumeric characters with hyphen
}

export type ToFileNameOptions =
  | {
      additions?: (string | number)[]
      extension: string
      mimeType?: never
    }
  | {
      additions?: (string | number)[]
      extension?: never
      mimeType: string
    }
export const toFileName = (name: string, opts: ToFileNameOptions) => {
  const { additions = [], extension: ext, mimeType } = opts

  const fileName = sanitizeFileName(name)
  const sanitizedAdditions = additions.map((s) => sanitizeFileName(s.toString()))
  const fileNameWithAdditions = [fileName, ...sanitizedAdditions].join('_')
  const fileExtension = ext || extension(mimeType!) || ''

  return [fileNameWithAdditions, fileExtension].join('.')
}
