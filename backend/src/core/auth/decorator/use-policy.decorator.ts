import { SetMetadata } from '@nestjs/common'
import { PolicyClass } from '../policy/policy'

export const USE_POLICY_KEY = 'use_policy'

export function UsePolicy(policy: PolicyClass<any, any>) {
  return SetMetadata(USE_POLICY_KEY, policy)
}
