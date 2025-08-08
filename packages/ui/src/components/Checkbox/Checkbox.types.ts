import type { Color, Size } from '../types';
import {FormFieldProps} from "../Form";

type CheckboxColor = Exclude<Color, 'destructive'>;
type CheckboxType = "rectangle" | "circle";

export interface CheckboxProps
    extends Omit<React.ComponentProps<'input'>, 'size' | 'type' | 'onChange' | 'value'>,
    Partial<FormFieldProps<boolean>>{
        color?: CheckboxColor;
        size?: Size;
        type?: CheckboxType;
        label?: string;
        indeterminate?: boolean;
        inputClassName?: string;
}