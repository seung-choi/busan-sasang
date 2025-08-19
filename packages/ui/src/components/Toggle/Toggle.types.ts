import { Size } from '../types';

export interface ToggleProps extends Omit<React.ComponentProps<'button'>, 'onChange'>{
    size?: Size;
    pressed?: boolean;
    onChange?: (pressed: boolean) => void;
}