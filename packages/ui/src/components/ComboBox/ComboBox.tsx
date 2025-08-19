import React, { createContext, useState, useContext } from "react";
import { cn } from "../../utils/classname";
import type { 
    ComboBoxProps,
    ComboBoxTriggerProps,
    ComboBoxContentProps,
    ComboBoxItemProps,
 } from "./ComboBox.types";

interface ComboBoxContextProps{
    disabled: boolean;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedValue: string;
    toggleValue: (value: string) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
}

const ComboBoxContext = createContext<ComboBoxContextProps | undefined>(undefined);

const ComboBox = ({
    disabled = false,
    selected,
    onChange,
    className,
    children,
    ...props
}: ComboBoxProps) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [inputValue, setInputValue] = useState("");
    const isControlled = selected !== undefined;
    const currentSelected = isControlled ? selected : selectedValue;

    const toggleValue = (value: string) => {
        if (!isControlled) {
          setSelectedValue(value);
        }
        if (onChange) {
          onChange(value);
        }
        setIsSelectOpen(false);
      };

    return (
        <ComboBoxContext.Provider
            value={{
                isSelected: isSelectOpen,
                setIsSelected: setIsSelectOpen,
                toggleValue,
                selectedValue: currentSelected,
                disabled,
                inputValue,
                setInputValue,
            }}
        >
            <div
                role="combobox"
                aria-expanded={isSelectOpen}
                aria-haspopup="listbox"
                className={cn("relative inline-block w-full", className)}
                {...props}
            >
                {children}
            </div>
        </ComboBoxContext.Provider>
    )
}

ComboBox.displayName = "ComboBox";

const ComboBoxTrigger = ({
    placeholder = "입력하세요.",
    inputClassName,
    className,
    ...props
}: ComboBoxTriggerProps) => {
    const context = useContext(ComboBoxContext);

    if (!context) {
      throw new Error("ComboBoxTrigger ComboBox 구성 요소 내에서 사용해야 합니다. <ComboBox.Trigger>이 <ComboBox> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
  
    const { isSelected, setIsSelected, selectedValue, disabled } = context;

    return (
        <div
            onClick={() => !disabled && setIsSelected(!isSelected)}
            className={cn(
                "flex items-center w-full h-10 p-2 rounded-md border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 transition-all duration-200",
                disabled && "bg-slate-100 cursor-not-allowed text-slate-400",
                className
            )}
            {...props}
        >
            <input
                type="text"
                aria-expanded={isSelected}
                aria-controls="listbox"
                aria-autocomplete="list"
                className={cn(
                    "w-full outline-none placeholder-slate-400 bg-transparent text-sm cursor-pointer",
                    disabled && "cursor-not-allowed",
                    inputClassName
                )}
                placeholder={placeholder}
                value={selectedValue}
                readOnly
            />
            <span
                className={cn(
                    "ml-2 inline-block transform transition-transform duration-300",
                    isSelected ? "rotate-180" : "rotate-0"
                )}
            >
        ▼
      </span>
        </div>
    );
};

ComboBoxTrigger.displayName = "ComboBoxTrigger";

const ComboBoxContent = ({
    inputClassName,
    className,
    children,
    ...props
}: ComboBoxContentProps) => { 

    const context = useContext(ComboBoxContext);

    if(!context) {
        throw new Error("ComboBoxContent는 Dropdown 구성 요소 내에서 사용해야 합니다. <ComboBox.Content>가 <ComboBox> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { isSelected, inputValue, setInputValue } = context;

    if (!isSelected) return null;

    const filteredChildren = React.Children.toArray(children).filter((child) => {
        if (React.isValidElement(child) && inputValue) {
            const childProps = child.props as ComboBoxItemProps;
            return childProps.children?.toString().toLowerCase().includes(inputValue.toLowerCase());
        }
        return true;
    });

    return(
        <ul
            role="listbox"
            id="listbox"
            aria-label="선택 목록"
            className={cn(
                "absolute top-full mt-1 z-50 w-full max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-md p-2 text-sm transition",
                className
            )}
            {...props}
        >
            <li>
                <input
                    type="text"
                    className={cn(
                        "w-full px-2 py-1 mb-2 rounded-md border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200",
                        inputClassName
                    )}
                    placeholder="검색하세요."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </li>

            {filteredChildren.length > 0 ? (
                filteredChildren
            ) : (
                <li className="text-slate-400 px-2 py-1">검색 결과가 없습니다.</li>
            )}
        </ul>
    );
};

ComboBoxContent.displayName = "ComboBoxContent";

const ComboBoxItem = ({
    value,
    className,
    children,
    ...props
}: ComboBoxItemProps) => {
    const context = useContext(ComboBoxContext);
    if(!context) {
        throw new Error("ComboBoxItem은 ComboBox 구성 요소 내에서 사용해야 합니다. <ComboBox.Item>이 <ComboBox> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { selectedValue, toggleValue } = context;

    const isItemSelected = selectedValue.includes(value);

    const onItemChange = () => {
        toggleValue(value);          
      };

    return (
        <li
            role="option"
            aria-selected={isItemSelected}
            value={value}
            onClick={onItemChange}
            className={cn(
                "text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer",
                isItemSelected && "text-blue-600 font-medium",
                className
            )}
            {...props}
        >{children}</li>
    )
}

ComboBoxItem.displayName = "ComboBoxItem";

export { ComboBox, ComboBoxTrigger, ComboBoxContent, ComboBoxItem };