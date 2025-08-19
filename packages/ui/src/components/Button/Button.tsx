import * as React from 'react';
import { cn } from '../../utils/classname';
import type { ButtonProps } from './Button.types';
import { useFormContext } from "../Form";

const Button = React.memo(({
                               className,
                               variant = 'default',
                               color = 'default',
                               size = 'medium',
                               isLoading = false,
                               disabled,
                               children,
                               ref,
                               ...props
                           }: ButtonProps) => {
    const baseStyle =
        "inline-flex items-center justify-center gap-2 rounded-lg w-full h-10 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
        default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
        outline: "border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100",
        ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
    };

    const colorStyles = {
        default: "",
        primary: "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
        destructive: "bg-destructive-500 text-white hover:bg-red-700",
    };

    const sizeStyles = {
        small: "h-8 px-3 text-xs",
        medium: "h-9 px-4 text-sm",
        large: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-2",
    };

    const spinnerStyle =
        "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin";

    const cursorStyles = cn({
        'cursor-progress': isLoading,
        'cursor-not-allowed': disabled && !isLoading,
        'cursor-pointer': !disabled && !isLoading,
        'disabled:bg-gray-200 disabled:text-gray-500': disabled || isLoading
    });

    return (
        <button
            className={cn(
                baseStyle,
                variantStyles[variant],
                variant === 'default' && colorStyles[color],
                sizeStyles[size],
                cursorStyles,
                className
            )}
            ref={ref}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className={cn(spinnerStyle, "me-1")} />
                    {children}
                </>
            ) : (
                children
            )}
        </button>
    );
});

Button.displayName = 'Button';

const FormSubmitButton = React.memo(({
                                         children,
                                         color = 'primary',
                                         size = 'medium',
                                         isLoading = false,
                                     }: ButtonProps) => {
    const { isValid } = useFormContext();

    return (
        <Button
            type="submit"
            color={color}
            size={size}
            disabled={!isValid}
            isLoading={isLoading}
        >
            {children}
        </Button>
    );
});

export { Button, FormSubmitButton };
