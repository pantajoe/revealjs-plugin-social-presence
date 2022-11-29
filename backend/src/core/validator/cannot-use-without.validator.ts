import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ async: false })
export class CannotUseWithout implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any
    const required = args.constraints[0] as string
    return object[required] !== undefined
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" cannot be used without "${args.constraints[0]}".`
  }
}
