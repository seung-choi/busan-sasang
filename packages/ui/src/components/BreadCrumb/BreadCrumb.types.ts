import type { Color, Size } from '../types';

type BreadCrumbColor = Exclude<Color, 'destructive'>;

export interface BreadCrumbProps extends React.ComponentProps<'nav'> {
    color?: BreadCrumbColor;
    size?: Size;
    separator?: 'line' | 'arrow';
}

export interface BreadCrumbItemProps extends React.ComponentProps<'li'> {
    isLastItem?: boolean;
}