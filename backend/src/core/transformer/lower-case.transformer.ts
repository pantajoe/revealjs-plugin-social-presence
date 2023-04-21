import { Transform } from 'class-transformer'

export function LowerCase(): PropertyDecorator {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.toLowerCase() : value
  })
}
