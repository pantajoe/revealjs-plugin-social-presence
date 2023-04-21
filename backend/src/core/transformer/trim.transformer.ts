import { Transform } from 'class-transformer'

export function Trim(): PropertyDecorator {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : value
  })
}
