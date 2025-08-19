import type { Color, Size } from '../types';

type BadgeSize = Size | 'xsmall';

export interface BadgeProps extends React.ComponentProps<'span'>{
    color?: Color;
    size?: BadgeSize;
    label?: string;
}