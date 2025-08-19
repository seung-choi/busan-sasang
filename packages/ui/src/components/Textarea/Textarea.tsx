import * as React from "react";
import { cn } from "../../utils/classname";
import type { TextareaProps } from "./Textarea.types";

const Textarea = ({
                      ariaLabel,
                      resize = "none",
                      invalid = false,
                      value,
                      onChange,
                      className,
                      ref,
                      ...props
                  }: TextareaProps) => {
    const textareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
    };

    const baseStyle = "w-full h-32 px-3 py-2 text-sm rounded-md border transition-colors";
    const textColorStyle = invalid
        ? "border-red-500 text-red-600 placeholder:text-red-400 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 text-slate-800 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500";

    const disabledStyle =
        "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200";

    const resizeStyle = {
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
        none: "resize-none",
    }[resize];

    return (
        <textarea
            aria-label={ariaLabel}
            value={value}
            onChange={textareaChange}
            ref={ref}
            className={cn(
                baseStyle,
                textColorStyle,
                disabledStyle,
                resizeStyle,
                className
            )}
            {...props}
        />
    );
};

Textarea.displayName = "Textarea";

export { Textarea };
