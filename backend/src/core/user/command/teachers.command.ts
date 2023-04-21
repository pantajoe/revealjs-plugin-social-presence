import { Command, CommandRunner } from 'nest-commander'
import { TeachersRegisterCommand } from './teachers.register.command'

@Command({
  name: 'teachers',
  description: 'Manages teachers',
  subCommands: [TeachersRegisterCommand],
})
export class TeachersCommand extends CommandRunner {
  run(_passedParams: string[], _options?: Record<string, any> | undefined): Promise<void> {
    this.command.help()
  }
}
