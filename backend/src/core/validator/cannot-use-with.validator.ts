import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ async: false })
export class CannotUseWith implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any
    const result = args.constraints.every((propertyName) => {
      return object[propertyName] === undefined
    })
    return result
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" cannot be used with "${args.constraints.join('` , `')}".`
  }
}
