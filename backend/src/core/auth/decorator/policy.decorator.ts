import { Injectable } from '@nestjs/common'

export function Policy(): ClassDecorator {
  return Injectable()
}
