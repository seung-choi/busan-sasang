import type { Color, Size } from '../types';

type TimeColor = Exclude<Color, 'destructive'>;

export interface TimeProps extends React.ComponentProps<'time'> {
    color?: TimeColor;
    size?: Size;
    lang?: string;
    format? :string;
}