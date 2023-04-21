/* eslint-disable no-console */
import chalk from 'chalk'
import { CommandRunner, Option, SubCommand } from 'nest-commander'
import { InjectRepository } from '@mikro-orm/nestjs'
import { isEmail, isHexColor } from 'class-validator'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { RegisterInput } from '../graphql/type'
import { User, UserRole } from '../model'
import { PasswordService } from '../service'
import { EntityRepository } from '~/orm'

export type Options = PartialBy<Pick<RegisterInput, 'email' | 'name' | 'bio' | 'color' | 'password'>, 'bio' | 'color'>

@SubCommand({
  name: 'register',
  description: 'Registers a teacher user',
})
export class TeachersRegisterCommand extends CommandRunner {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    private readonly passwordService: PasswordService,
  ) {
    super()
  }

  @UseRequestContext()
  async run(inputs: string[], options: Options): Promise<void> {
    let user: User | undefined
    try {
      const { email, name, password, bio = '', color: profileColor = '#f97316' } = options
      user = this.userRepo.create({
        email,
        name,
        password: this.passwordService.hashPassword(password),
        bio,
        profileColor,
        role: UserRole.Instructor,
      })
      await this.userRepo.persistAndFlush(user)
    } catch (err) {
      this.command.error(chalk.red(`Failed to create user with reason: ${err}`))
    }

    console.log(
      // eslint-disable-next-line prettier/prettier
      chalk.green(`Created teacher with email ${chalk.bold(`"${user.email}"`)} successfully (${chalk.bold(`ID: ${user.id}`)})`),
    )
  }

  @Option({
    flags: '-e, --email <email>',
    name: 'email',
    description: 'The email address of the user',
    required: true,
  })
  parseEmail(email: string) {
    if (isEmail(email)) return email
    this.command.error(chalk.red(`"${chalk.bold(email)}" is not a valid email address`))
  }

  @Option({
    flags: '-n, --name <full_name>',
    name: 'name',
    description: 'The full name of the user',
    required: true,
  })
  parseName(name: string) {
    return name
  }

  @Option({
    flags: '-p, --password <password>',
    name: 'password',
    description: 'The unencrypted password of the user',
    required: true,
  })
  parsePassword(password: string) {
    return password
  }

  @Option({
    flags: '-c, --color <hex_color>',
    name: 'color',
    description: 'The profile color of the user in HEX format. Default color is orange.',
    defaultValue: '#f97316',
  })
  parseColor(color: string) {
    if (isHexColor(color)) return color
    this.command.error(chalk.red(`"${chalk.bold(color)}" is not a valid HEX color`))
  }

  @Option({
    flags: '-b, --bio <biography>',
    name: 'bio',
    description: 'A short introductory text that acts as the biography of the user',
  })
  parseBio(bio: string) {
    return bio
  }
}
