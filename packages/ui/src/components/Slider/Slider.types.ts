import type { Color, Size } from '../types';

type SliderColor = Exclude<Color, 'destructive'>;

export interface SliderContextProps {
    disabled?: boolean;
    currentValue: number;
    setCurrentValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
    size: Size;
    color: SliderColor;
    sliderId: string;
    sliderRef: { current: HTMLDivElement | null };
}

export interface SliderProps extends React.ComponentProps<'div'> {
    defaultValue?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    size?: Size;
    color?: SliderColor;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

export interface SliderTrackProps extends React.ComponentProps<'div'> {
    children?: React.ReactNode;
}

export interface SliderThumbProps extends React.ComponentProps<'span'> {
    tabIndex?: number;
    size?: Size;
}

export interface SliderRangeProps extends React.ComponentProps<'input'> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
