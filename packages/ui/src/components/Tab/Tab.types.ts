import type { Color } from '../types';

export interface TabContextProps {
    currentValue?: string;
    setCurrentValue: (value: string) => void;
    baseId: string;
    color?: Color;
}

export interface TabProps extends React.ComponentProps<'div'>{
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    color?: Color;
}

export interface TabListProps extends React.ComponentProps<'div'>{
    color?: Color;
}

export interface TabTriggerProps extends React.ComponentProps<'button'>{
    isActive?: boolean;
    value: string;
    color?: Color;
}

export interface TabContentProps extends React.ComponentProps<'div'>{
    isActive?: boolean;
    value: string;
} 