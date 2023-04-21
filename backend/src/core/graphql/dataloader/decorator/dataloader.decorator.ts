import { Injectable, Scope } from '@nestjs/common'

export function Dataloader(): ClassDecorator {
  return Injectable({ scope: Scope.REQUEST })
}
