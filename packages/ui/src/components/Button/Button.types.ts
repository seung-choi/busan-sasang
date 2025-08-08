import type { Color, Size } from '../types';

type ButtonVariant = 'outline' | 'ghost' | 'default';
type ButtonColor = Color | 'default';
type ButtonSize = Size | 'icon';

export interface ButtonProps extends React.ComponentProps<'button'> {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    isLoading?: boolean;
  }