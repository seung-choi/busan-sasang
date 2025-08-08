import { Input } from './Input';
import { InputProps } from "@plug/ui";
import { forwardRef } from 'react';

const InputText = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input type="text" ref={ref} {...props} />
  );
});

InputText.displayName = 'InputText';

export { InputText };