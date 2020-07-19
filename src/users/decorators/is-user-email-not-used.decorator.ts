import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUserEmailNotUsedConstraint } from '../validators/is-user-email-not-used.constraint';

export function IsUserEmailNotUsed(options?: ValidationOptions): PropertyDecorator {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsUserEmailNotUsedConstraint
    });
  };
}
