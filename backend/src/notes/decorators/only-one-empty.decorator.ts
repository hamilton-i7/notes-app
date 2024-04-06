import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function OnlyOneEmpty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'onlyOneEmpty',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (typeof value !== 'string') return false;
          if (typeof relatedValue !== 'string') return false;

          if (!value.trim()) {
            if (relatedValue.trim().length === 0) return false;
            return true;
          }

          if (!relatedValue.trim()) {
            if (value.trim().length === 0) return false;
            return true;
          }
          return true;
        },
      },
    });
  };
}
