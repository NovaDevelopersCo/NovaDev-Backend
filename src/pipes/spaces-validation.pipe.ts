/* eslint-disable @typescript-eslint/ban-types */
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator'

export function IsNotWhitespace(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && value.trim().length > 0
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} не может состоять только из пробелов.`
                },
            },
        })
    }
}
