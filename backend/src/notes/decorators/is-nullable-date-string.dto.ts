import { ValidateBy, ValidationOptions, isDateString } from 'class-validator';
import { INVALID_ARCHIVED_AT_FORMAT_ERROR } from '../utilities/constants';

const IS_NULLABLE_DATE_STRING = 'isNullableDateString';

export function IsNullableDateString(options?: ValidationOptions) {
  return ValidateBy(
    {
      name: IS_NULLABLE_DATE_STRING,
      validator: {
        validate: (value: unknown) => {
          if (value === null) return true;
          if (typeof value !== 'string') return false;
          return isDateString(value, { strict: true, strictSeparator: true });
        },
        defaultMessage: () => INVALID_ARCHIVED_AT_FORMAT_ERROR,
      },
    },
    options,
  );
}
