export const parseSafeJson = <T = any>(json: string): T | null => {
  try {
    return JSON.parse(json) as T
  } catch (e) {
    return null
  }
}

export const parseSafeUrl = (url: string): URL | null => {
  try {
    return new URL(url)
  } catch (e) {
    return null
  }
}

export const isEnv = (...env: Array<typeof process.env.NODE_ENV>): boolean => env.includes(process.env.NODE_ENV)
