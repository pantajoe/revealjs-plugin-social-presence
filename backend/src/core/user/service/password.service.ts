import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

interface GeneratePasswordOptions {
  numbers?: boolean
  uppercase?: boolean
  symbols?: boolean
  length?: number
}

@Injectable()
export class PasswordService {
  generateRandomPassword(options: GeneratePasswordOptions = {}) {
    const { numbers = true, uppercase = true, symbols = true, length = 12 } = options
    const characters = [
      ...(numbers ? '0123456789' : ''),
      ...(uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''),
      ...(symbols ? '!@#$%^&*()' : ''),
    ]
    let password = ''
    for (let i = 0; i < length; i++) password += characters[Math.floor(Math.random() * characters.length)]

    return password
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(8)
    return bcrypt.hashSync(password, salt)
  }
}
