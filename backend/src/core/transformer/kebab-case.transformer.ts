import { Transform } from 'class-transformer'
import { kebabCase } from 'lodash'

export function KebabCase(): PropertyDecorator {
  return Transform(({ value }) => {
    return typeof value === 'string' ? kebabCase(value) : value
  })
}
