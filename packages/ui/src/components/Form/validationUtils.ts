// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorFn<T = any> = (value: T) => string | undefined;
export type ValidationErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

export const required = (message = '이 필드는 필수입니다'): ValidatorFn => {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
  };
};

export const email = (message = '올바른 이메일 형식이 아닙니다'): ValidatorFn<string> => {
  return (value) => {
    if (!value) return;
    const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) return message;
  };
};

export const minLength = (min: number, message?: string): ValidatorFn<string> => {
  return (value) => {
    if (!value) return;
    return value.length >= min ? undefined : message ?? `최소 ${min}자 이상 입력해주세요`;
  };
};

export const maxLength = (max: number, message?: string): ValidatorFn<string> => {
  return (value) => {
    if (!value) return;
    return value.length <= max ? undefined : message ?? `최대 ${max}자까지 입력 가능합니다`;
  };
};

export const composeValidators = <T>(
    validators: ValidatorFn<T>[],
    value: T
): string | undefined => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
};

export const createValidator = <T extends Record<string, unknown>>(
    rules: Partial<Record<keyof T, ValidatorFn[]>>,
): ((values: T) => ValidationErrors<T>) => {
  return (values: T) => {
    const errors: ValidationErrors<T> = {};

    for (const key in rules) {
      const validators = rules[key];
      if (!validators) continue;

      const error = composeValidators(validators, values[key]);
      if (error) {
        errors[key] = error;
      }
    }

    return errors;
  };
};
