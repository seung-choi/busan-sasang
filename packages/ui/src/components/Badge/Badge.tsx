import * as React from 'react';
import {cn} from '../../utils/classname';
import type { BadgeProps } from './Badge.types';

const Badge = React.memo(({
    color = 'primary',
    size = 'small',
    className,
    label,
    ref,
    children,
    ...props
} : BadgeProps) => {

    const badgeStyle = 'inline-flex justify-center items-center font-extrabold box-border rounded-full';
    
    const colorStyle = {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-slate-200 text-slate-800',
        destructive: 'bg-red-100 text-red-800',
    }[color];

    const sizeStyle = {
        xsmall : 'text-xs px-2 py-1',
        small : 'text-sm px-2 py-1',
        medium : 'text-base px-4 py-2',
        large : 'text-lg px-4 py-2'
    }[size];

    return(
        <span
            role="status" 
            aria-live="polite" 
            aria-label={label}
            ref={ref}
            className={cn(
                badgeStyle,
                colorStyle,
                sizeStyle,
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
});

Badge.displayName = 'Badge';

export { Badge };