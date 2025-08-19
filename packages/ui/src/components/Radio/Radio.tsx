import { createContext, useContext, useState } from "react";
import { cn } from "../../utils/classname";
import type { RadioGroupProps, RadioGroupItemProps } from "./Radio.types";

interface RadioGroupContextProps {
  color: string;
  size: string;
  name: string;
  disabled?: boolean;
  selectedValue: string;
  toggleValue: (value: string) => void;
}
const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

const RadioGroup = ({
                      defaultValue = "",
                      color = "primary",
                      size = "small",
                      selected,
                      name,
                      disabled,
                      onChange,
                      children,
                      ref,
                      ...props
                    }: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const isSelected = selected !== undefined;
  const currentSelected = isSelected ? selected : selectedValue;

  const toggleValue = (value: string) => {
    if (!isSelected) {
      setSelectedValue(value);
    }
    if (onChange) {
      onChange(value);
    }
  };

  return (
      <RadioGroupContext.Provider value={{ color, size, name, disabled, toggleValue, selectedValue: currentSelected }}>
        <div
            role="radiogroup"
            className={cn("grid gap-2", props.className)}
            ref={ref}
            {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = ({
                          value,
                          label,
                          className,
                          inputClassName,
                          onChange,
                          ref,
                          ...props
                        }: RadioGroupItemProps) => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem은 RadioGroup 내에서 사용되어야 합니다.");
  }

  const { color, size, name, disabled, selectedValue, toggleValue } = context;

  const handleChange = () => {
    if (onChange) {
      onChange(value);
    } else {
      toggleValue(value);
    }
  };

  const isChecked = selectedValue === value;

  const inputBase = "z-1 inline-block border rounded-full relative bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full";
  const inputSize = {
    small: "w-4 h-4 after:w-2 after:h-2",
    medium: "w-5 h-5 after:w-2.5 after:h-2.5",
    large: "w-6 h-6 after:w-3 after:h-3",
  }[size];

  const inputColor = {
    primary: isChecked ? "border-blue-600 after:bg-blue-600" : "border-slate-300",
    secondary: isChecked ? "border-teal-600 after:bg-teal-600" : "border-slate-300",
  }[color];

  const inputDisabled = disabled
      ? "bg-slate-100 border-slate-300 after:bg-slate-300 cursor-not-allowed"
      : "";

  const labelBase = "inline-flex items-center gap-2 cursor-pointer";
  const labelSize = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  const labelColor = disabled ? "text-slate-400 cursor-not-allowed" : "text-slate-800";

  return (
      <label
          className={cn(
              labelBase,
              labelSize,
              labelColor,
              className
          )}
      >
        <input
            ref={ref}
            type="radio"
            className="absolute opacity-0 z-1"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
        />
        <span
            className={cn(
                inputBase,
                inputSize,
                inputColor,
                inputDisabled,
                isChecked ? "after:block" : "after:hidden",
                inputClassName
            )}
        ></span>
        {label}
      </label>
  );
};

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
