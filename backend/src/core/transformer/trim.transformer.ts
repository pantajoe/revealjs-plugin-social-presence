import { Transform } from 'class-transformer'

export const Trim = (): PropertyDecorator =>
  Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : value
  })
