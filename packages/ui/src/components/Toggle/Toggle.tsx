import { useState } from "react";
import { cn } from "../../utils/classname";
import type {  ToggleProps } from "./Toggle.types";

const Toggle = ({
    size = "small",
    pressed,
    disabled,
    onChange,
    className,
    ref,
    children,
    ...props
}: ToggleProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const isControlled = pressed !== undefined;
    const currentPressed = isControlled ? pressed : isPressed;
    
    const onPressChange = () => {
        const newPressed = !currentPressed;
        if (!isControlled) {
            setIsPressed(newPressed);
        }

        if(onChange) {
            onChange(newPressed);
        }
    };

    const ToggleStyle = `inline-flex items-center justify-center gap-2 rounded-md text-gray-700 font-medium border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100
    transition-all duration-300 ${currentPressed ? "bg-gray-100" : "bg-transparent"} ${disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`;

    const ToggleSize = {
        small: "h-9 px-2 min-w-9 text-sm",
        medium: "h-10 px-3 min-w-10 text-base",
        large: "h-11 px-4 min-w-11 text-lg",
    }[size];

    return(
        <button
            onClick={onPressChange}
            aria-pressed={currentPressed}
            className={cn(
                ToggleStyle,
                ToggleSize,
                className,
            )}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    )
}

Toggle.displayName = "Toggle";

export { Toggle };

