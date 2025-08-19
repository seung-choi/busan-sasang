import { useState, createContext, useContext } from "react";
import { cn } from "../../utils/classname";
import type { 
    ToggleGroupProps,
    ToggleGroupItemProps,
} from "./ToggleGroup.types";

type ToggleGroupContextType = {
    size: "small" | "medium" | "large";
    pressedValues: string[];
    toggleValue: (value: string) => void;
    disabled: boolean;
};

const ToggleGroupContext = createContext<ToggleGroupContextType | undefined>(undefined);

const ToggleGroup = ({
    type = "single",
    size = "small",
    disabled = false,
    pressed,
    defaultPressed = [],
    onChange,
    className,
    children,
    ...props
}: ToggleGroupProps) => {

    const [pressedValues, setPressedValues] = useState<string[]>(defaultPressed);

    const isControlled = pressed !== undefined;
    const currentPressed = isControlled ? pressed : pressedValues;

    const toggleValue = (value: string) => {
        if (type === "single") {
            const newSelectedValues = [value];
            if(!isControlled) {
                setPressedValues(newSelectedValues);
            }
            if (onChange) {
                onChange(newSelectedValues);
            }
    
        } else if (type === "multiple") {
            setPressedValues((prev) => {

                const selectedValuesSet = new Set(prev);
                
                if (selectedValuesSet.has(value)) {
                    selectedValuesSet.delete(value);
                } else {
                    selectedValuesSet.add(value);
                }
                
                const newSelectedValues = [...selectedValuesSet]; 
                if (onChange) {
                    onChange(newSelectedValues);
                }
                return newSelectedValues; 
            });

        }
    };
    
    return (
        <ToggleGroupContext value={{ 
            size, 
            disabled, 
            pressedValues: currentPressed, 
            toggleValue 
        }}>
            <div
                className={cn(
                    'inline-flex items-center gap-2 justify-center',
                    className
                )}
                role="group"
                {...props}
            >
                {children}
            </div>
        </ToggleGroupContext>
    );
};
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = ({
    value,
    className,
    children,
    ...props
}: ToggleGroupItemProps) => {
    
    const context = useContext(ToggleGroupContext);
    
    if (!context) {
        throw new Error("ToggleGroupItem은 ToggleGroup 구성 요소 내에서 사용해야 합니다. <ToggleGroup.Item>이 <ToggleGroup> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    const { size, disabled, pressedValues, toggleValue } = context;

    const isPressed = pressedValues.includes(value);

    const onPressChange = () => {
        toggleValue(value); 
    };

    const ToggleGroupStyle = `inline-flex items-center justify-center gap-2 rounded-md text-gray-700 font-medium border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100
    transition-all duration-300 ${isPressed ? "bg-gray-100" : "bg-transparent"} ${disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`;

    const ToggleGroupSize = {
        small: "h-9 px-2 min-w-9 text-sm",
        medium: "h-10 px-3 min-w-10 text-base",
        large: "h-11 px-4 min-w-11 text-lg",
    }[size];


    return (
        <button
            onClick={onPressChange}
            aria-pressed={isPressed}
            value={value}
            className={cn(
                ToggleGroupStyle,
                ToggleGroupSize,
                className,
            )}
            {...props}
        >
            {children} 
        </button>
    );
};
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };

