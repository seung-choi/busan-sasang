import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/classname";
import { InputProps } from "@plug/ui";

const Input = React.forwardRef<HTMLInputElement, InputProps<string>>((props, ref) => {
    const {
        id,
        ariaLabel,
        type = "text",
        invalid = false,
        iconPosition = "leading",
        iconSvg,
        renderIcon,
        value,
        onChange,
        required,
        className,
        disabled,
        ...rest
    } = props;

    const [inputFocus, setInputFocus] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    const iconColor = invalid
        ? "#dc2626"
        : disabled
            ? "#d1d5db"
            : inputFocus
                ? "#1e293b"
                : "#9ca3af";

    const inputWrapperStyle = cn(
        "inline-flex items-center w-full rounded-md border transition-colors h-10 px-3 gap-2",
        disabled
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
            : invalid
                ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                : "border-slate-300 hover:border-slate-400 focus-within:ring-1 focus-within:ring-primary-500"
    );

    const inputStyle = cn(
        "w-full bg-transparent outline-none text-sm placeholder:text-slate-400 disabled:cursor-not-allowed",
        invalid && "text-red-600 placeholder:text-red-400",
        disabled && "text-slate-400",
        className
    );

    const defaultIcon = () => {
        if (!iconSvg) return null;
        const Icon = iconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
        return <Icon className="w-4 h-4 shrink-0" fill={iconColor} />;
    };

    const renderIconComponent = () => {
        if (renderIcon) {
            return renderIcon({ iconColor, isFocused: inputFocus });
        }
        return defaultIcon();
    };

    return (
        <div className={inputWrapperStyle}>
            {iconPosition === "leading" && renderIconComponent()}
            <input
                id={id}
                ref={ref}
                type={type}
                value={value}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                onChange={handleChange}
                aria-describedby={id}
                aria-label={ariaLabel}
                required={required}
                disabled={disabled}
                className={inputStyle}
                {...rest}
            />
            {iconPosition === "trailing" && renderIconComponent()}
        </div>
    );
});

Input.displayName = "Input";

export { Input };
