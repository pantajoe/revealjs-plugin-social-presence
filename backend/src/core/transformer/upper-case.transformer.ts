import { Transform } from 'class-transformer'

export function UpperCase(): PropertyDecorator {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.toUpperCase() : value
  })
}
