import { Transform } from 'class-transformer'

export const LowerCase = (): PropertyDecorator =>
  Transform(({ value }) => {
    return typeof value === 'string' ? value.toLowerCase() : value
  })
