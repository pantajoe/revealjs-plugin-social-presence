import { Transform } from 'class-transformer'

export const UpperCase = (): PropertyDecorator =>
  Transform(({ value }) => {
    return typeof value === 'string' ? value.toUpperCase() : value
  })
