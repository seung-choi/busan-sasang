import { cn } from "../../utils/classname";
import { createContext, useState, useContext } from "react";
import type { DropdownProps, DropdownItemProps } from "./Dropdown.types";

interface DropdownContextProps {
    disabled: boolean;
    variant: "default" | "error";
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedValue: string[];
    toggleValue: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

const Dropdown = ({
                      type = "single",
                      variant = "default",
                      disabled = false,
                      selected,
                      onChange,
                      className,
                      children,
                      ...props
                  }: DropdownProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string[]>([]);

    const isControlled = selected !== undefined;
    const currentSelected = isControlled ? selected : selectedValue;

    const toggleValue = (value: string) => {
        if (type === "single") {
            const newSelectedValues = [value];
            if (!isControlled) setSelectedValue(newSelectedValues);
            onChange?.(newSelectedValues);
            setIsDropdownOpen(false);
        } else {
            setSelectedValue((prev) => {
                const set = new Set(prev);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                set.has(value) ? set.delete(value) : set.add(value);
                const newSelected = [...set];
                onChange?.(newSelected);
                return newSelected;
            });
        }
    };

    return (
        <DropdownContext.Provider
            value={{
                isSelected: isDropdownOpen,
                setIsSelected: setIsDropdownOpen,
                selectedValue: currentSelected,
                toggleValue,
                disabled,
                variant,
            }}
        >
            <div
                className={cn("relative inline-block w-full", className)}
                {...props}
            >
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

Dropdown.displayName = "Dropdown";

const DropdownTrigger = ({
                             children,
                             ...props
                         }: React.ComponentProps<"div">) => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("DropdownTrigger must be used within Dropdown");

    const { isSelected, setIsSelected, disabled } = context;

    return (
        <div
            onClick={() => !disabled && setIsSelected(!isSelected)}
            className={cn("cursor-pointer", disabled && "opacity-50")}
            {...props}
        >
            {children}
        </div>
    );
};

DropdownTrigger.displayName = "DropdownTrigger";

const DropdownContent = ({
                             className,
                             children,
                         }: React.ComponentProps<"ul">) => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("DropdownContent must be used within Dropdown");

    const { isSelected, variant, disabled } = context;
    if (!isSelected) return null;

    return (
        <ul
            role="listbox"
            aria-expanded={isSelected}
            className={cn(
                "absolute top-full mt-1 z-50 w-52 max-h-52 overflow-y-auto bg-white border rounded-md shadow-sm p-1 text-sm",
                "border-slate-200",
                "[&::-webkit-scrollbar]:w-[6px]",
                "[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full",
                "hover:[&::-webkit-scrollbar-thumb]:bg-slate-400",
                disabled && "bg-slate-100 cursor-not-allowed opacity-60",
                variant === "error" && "border-red-500",
                className
            )}
        >
            {children}
        </ul>
    );
};

DropdownContent.displayName = "DropdownContent";

const DropdownItem = ({
                          value,
                          className,
                          children,
                          ...props
                      }: DropdownItemProps) => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("DropdownItem must be used within Dropdown");

    const { selectedValue, toggleValue, disabled, variant } = context;
    const isSelected = selectedValue.includes(value);

    return (
        <li
            role="option"
            aria-selected={isSelected}
            onClick={() => !disabled && toggleValue(value)}
            className={cn(
                "px-3 py-1.5 rounded-md transition-colors cursor-pointer select-none",
                isSelected
                    ? variant === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-primary-100 text-primary-700 font-medium"
                    : "text-slate-700 hover:bg-slate-100",
                disabled && "cursor-not-allowed text-slate-400 bg-transparent hover:bg-transparent",
                className
            )}
            {...props}
        >
            {children}
        </li>
    );
};

DropdownItem.displayName = "DropdownItem";

export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem };
