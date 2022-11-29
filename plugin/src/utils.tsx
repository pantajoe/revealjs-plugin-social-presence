import type { PropsWithChildren } from 'react'

import type { UseFormReturn } from 'react-hook-form'

export function parseJson<T>(json: string | null): T | null
export function parseJson<T>(json: string | null, defaultValue: T): T
export function parseJson<T, D extends T | undefined>(json: string | null, defaultValue?: D): T | D | null {
  if (json === null) return defaultValue === undefined ? null : defaultValue
  try {
    return JSON.parse(json)
  } catch (e) {
    return defaultValue ?? null
  }
}

export const TailwindColorMap = {
  emerald: '#10b981',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  indigo: '#6366f1',
  orange: '#f97316',
  cyan: '#06b6d4',
  fuchsia: '#d946ef',
  lime: '#84cc16',
  teal: '#14b8a6',
  red: '#ef4444',
  purple: '#a855f7',
  blue: '#3b82f6',
  pink: '#ec4899',
  rose: '#f43f5e',
  zinc: '#71717a',
} as const

export type TailwindColor = keyof typeof TailwindColorMap

export const TailwindColors = Object.keys(TailwindColorMap) as TailwindColor[]

export const hexToTailwindColor = (hex: string): TailwindColor => {
  for (const [color, hexColor] of Object.entries(TailwindColorMap)) {
    if (hexColor.toLowerCase() === hex.toLowerCase()) return color as TailwindColor
  }
  return 'zinc'
}

export const tailwindColorToHex = (color: TailwindColor): string => {
  return TailwindColorMap[color]
}

export const getDayDifference = (a: Date, b: Date): number => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))
}

export const composeProviders = (...providers: ((props: PropsWithChildren) => JSX.Element)[]) => {
  return providers.reduce((Prev, Curr) => ({ children }) => (
    <Prev>
      <Curr>{children}</Curr>
    </Prev>
  ))
}

export const handleFormError = (
  handleSubmit: ReturnType<UseFormReturn['handleSubmit']>,
  onError: (error: any) => void = () => {},
): ReturnType<UseFormReturn['handleSubmit']> => {
  return (event) => {
    return handleSubmit(event).catch(onError)
  }
}
