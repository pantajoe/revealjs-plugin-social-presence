export function parseSafeJson<T = any>(json: string): T | null {
  try {
    return JSON.parse(json) as T
  } catch (e) {
    return null
  }
}

export function parseSafeUrl(url: string): URL | null {
  try {
    return new URL(url)
  } catch (e) {
    return null
  }
}

export function isEnv(...env: Array<typeof process.env.NODE_ENV>): boolean {
  return env.includes(process.env.NODE_ENV)
}
