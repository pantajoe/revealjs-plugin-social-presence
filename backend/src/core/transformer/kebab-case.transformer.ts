import { Transform } from 'class-transformer'
import { kebabCase } from 'lodash'

export const KebabCase = (): PropertyDecorator =>
  Transform(({ value }) => {
    return typeof value === 'string' ? kebabCase(value) : value
  })
