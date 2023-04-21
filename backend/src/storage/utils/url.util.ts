import { join } from 'node:path'
import { isEnv } from '~/util'

export function getFileUrl<T extends string | null | undefined>(key: T): T extends null | undefined ? null : string {
  if (!key) return null as any

  const sanitizedKey = key.replace(/^\//, '')
  const protocol = isEnv('development', 'test') ? 'http' : 'https'
  const baseUrl = `${protocol}://${process.env.DOMAIN}`
  const url = new URL(join('storage', 'files', sanitizedKey), baseUrl)
  return url as any
}

export function getFileKey(assetUrl: string | null | undefined) {
  if (!assetUrl) return ''

  try {
    const url = new URL(assetUrl)
    return url.pathname.replace('/storage/files/', '')
  } catch (e) {
    return assetUrl || ''
  }
}
