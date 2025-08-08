import type { Color, Size } from '../types';
import {FormFieldProps} from "@plug/ui";

type RadioColor = Exclude<Color, 'destructive'>;

export interface RadioGroupProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    defaultValue?: string;
    color?: RadioColor;
    size?: Size;
    disabled?: boolean;
    name: string;
    selected?: string;
    onChange?: (value: string) => void;
}

export interface RadioGroupItemProps extends
    Omit<React.ComponentProps<'input'>, 'ref' | 'onChange' | 'value'>,
    Partial<FormFieldProps<string>> {
    value: string;
    label?: string;
    disabled?: boolean;
    inputClassName?: string;
    ref?: React.Ref<HTMLInputElement>;
}