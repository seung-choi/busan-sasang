import type { Size, Color } from '../types';

type SwitchColor = Exclude<Color, 'destructive'>;

export interface SwitchProps extends Omit<React.ComponentProps<'input'>, 'size' | 'color' | 'onChange'> {
    size?: Size;
    color?: SwitchColor;
    label?: string;
    onChange?: (checked: boolean) => void;
}