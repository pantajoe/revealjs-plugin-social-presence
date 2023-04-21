import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import { Injectable } from '@nestjs/common'
import { HmacSHA256 } from 'crypto-js'

@Injectable()
export class TokenService {
  generate(size: number = 32): string {
    return crypto.randomBytes(size).toString('hex')
  }

  digest(token: string): string {
    return HmacSHA256(token, process.env.SECRET_KEY_BASE).toString()
  }

  generatePair(size?: number): { token: string; digest: string } {
    const token = this.generate(size)
    const digest = this.digest(token)
    return { token, digest }
  }

  secureCompare(token: string, hashedToken: string): boolean {
    const digestedToken = this.digest(token)
    return crypto.timingSafeEqual(Buffer.from(digestedToken), Buffer.from(hashedToken))
  }
}
