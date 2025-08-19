import React from "react";
import { Size } from '../types';

type ToggleGroupType = 'single' | 'multiple';

export interface ToggleGroupProps extends Omit<React.ComponentProps<'div'>, 'onChange'>{
    size?: Size;
    type?: ToggleGroupType;
    disabled?: boolean;
    pressed?: string[];
    defaultPressed?: string[];
    onChange?: (values: string[]) => void;
}

export interface ToggleGroupItemProps extends React.ComponentProps<'button'>{
    value: string;
}