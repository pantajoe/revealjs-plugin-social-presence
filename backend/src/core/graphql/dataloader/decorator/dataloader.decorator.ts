import { Injectable, Scope } from '@nestjs/common'

export const Dataloader = (): ClassDecorator => Injectable({ scope: Scope.REQUEST })
