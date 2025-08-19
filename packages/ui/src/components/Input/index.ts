import { Input as InputComponent } from './Input';
import { InputPassword } from "./InputPassword";
import { InputText } from "./InputText";
import { InputLabel } from "./InputLabel";
import { InputHelperText } from "./InputHelperText";
import { InputBox } from "./InputBox";

const Input = Object.assign(InputComponent, {
  Text: InputText,
  Password: InputPassword,
  Label: InputLabel,
  HelperText: InputHelperText,
  Box: InputBox
});

export { Input };
export type { InputProps } from './Input.types';