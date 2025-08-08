import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
} from "react";
import { cn } from "../../utils/classname";
import { SelectCloseIcon } from "../../index.icons";
import type {
    SelectProps,
    SelectTriggerProps,
    SelectItemProps,
} from "./Select.types";

interface SelectContextProps {
    type: "single" | "multiple";
    variant: "default" | "error";
    disabled: boolean;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedItems: Map<string, React.ReactNode>; 
    setSelectedItems: React.Dispatch<React.SetStateAction<Map<string, React.ReactNode>>>;
    toggleValue: (value: string, item?: React.ReactNode) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

const Select = ({
                    type = "single",
                    variant = "default",
                    disabled = false,
                    selected,
                    onChange,
                    isOpened = false,
                    className,
                    children,
                    ...props
                }: SelectProps) => {
    const [isSelectOpen, setIsSelectOpen] = useState(isOpened);
    const [selectedItems, setSelectedItems] = useState<Map<string, React.ReactNode>>(new Map());

    const [searchValue, setSearchValue] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const isControlled = selected !== undefined;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isControlled) {
            const buildNewSelectedItems = (currentInternalSelectedItems: Map<string, React.ReactNode>): Map<string, React.ReactNode> => {
                const newMap = new Map<string, React.ReactNode>();
                const propSelectedValues = selected || [];
                
                const availableItemNodesFromChildren = new Map<string, React.ReactNode>();
                React.Children.forEach(children, (childComponent: React.ReactNode) => {
                    if (React.isValidElement(childComponent) && childComponent.type === SelectContent) {
                        const contentProps = childComponent.props as { children?: React.ReactNode };
                        React.Children.forEach(contentProps.children, (itemComponent: React.ReactNode) => {
                            if (React.isValidElement(itemComponent) && itemComponent.type === SelectItem) {
                                const itemProps = itemComponent.props as SelectItemProps;
                                if (itemProps.value && itemProps.children !== undefined) {
                                    availableItemNodesFromChildren.set(itemProps.value, itemProps.children);
                                }
                            }
                        });
                    }
                });

                for (const value of propSelectedValues) {
                    if (availableItemNodesFromChildren.has(value)) {
                        newMap.set(value, availableItemNodesFromChildren.get(value)!);
                    } else {
                        const existingNode = currentInternalSelectedItems.get(value);
                        if (existingNode && existingNode !== value) { 
                            newMap.set(value, existingNode);
                        } else {
                            newMap.set(value, value); 
                        }
                    }
                }
                return newMap;
            };

            setSelectedItems(prevSelectedItems => {
                const newCalculatedMap = buildNewSelectedItems(prevSelectedItems);

                let mapsAreEqual = newCalculatedMap.size === prevSelectedItems.size;
                if (mapsAreEqual && newCalculatedMap.size > 0) { 
                    for (const [key, val] of newCalculatedMap) {
                        if (!prevSelectedItems.has(key) || prevSelectedItems.get(key) !== val) {
                            mapsAreEqual = false;
                            break;
                        }
                    }
                    if(mapsAreEqual){
                        for (const key of prevSelectedItems.keys()) {
                            if (!newCalculatedMap.has(key)) {
                                mapsAreEqual = false;
                                break;
                            }
                        }
                    }
                }


                if (!mapsAreEqual) {
                    return newCalculatedMap;
                }
                return prevSelectedItems;
            });
        }
    }, [selected, children, isControlled, setSelectedItems]);

    const toggleValue = (value: string, itemNode?: React.ReactNode) => {
        const newItems = new Map(selectedItems); 

        if (type === "single") {
            const isAlreadySelected = newItems.has(value);
            newItems.clear(); 
            if (!isAlreadySelected) { 
                 if (itemNode !== undefined) {
                    newItems.set(value, itemNode);
                } else {
                    newItems.set(value, value); 
                }
            }
            const newSelectedValueArray = Array.from(newItems.keys());

            if (!isControlled) {
                setSelectedItems(newItems);
            }
            onChange?.(newSelectedValueArray); 
            setIsSelectOpen(false);
            // Single 모드에서 항목 선택 시 검색값 초기화
            setSearchValue("");
        } else { 
            if (newItems.has(value)) {
                newItems.delete(value);
            } else {
                if (itemNode !== undefined) {
                    newItems.set(value, itemNode);
                } else {
                    newItems.set(value, value); 
                }
            }
            if (!isControlled) {
                setSelectedItems(newItems);
            }
            onChange?.(Array.from(newItems.keys())); 
            setSearchValue(""); 
        }
    };
    return (
        <SelectContext.Provider
            value={{
                type,
                variant,
                disabled,
                isSelected: isSelectOpen,
                setIsSelected: setIsSelectOpen,
                selectedItems,
                setSelectedItems,
                toggleValue,
                searchValue,
                setSearchValue,
            }}
        >
            <div
                ref={ref}
                role="combobox"
                aria-expanded={isSelectOpen}
                aria-haspopup="listbox"
                className={cn("relative w-full", className)}
                {...props}
            >
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = ({
                           placeholder = "선택하세요.",
                           inputClassName,
                           className,
                           ...props
                       }: SelectTriggerProps) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger는 Select 내부에서 사용해야 합니다.");

    const {
        isSelected,
        setIsSelected,
        selectedItems,
        variant,
        type,
        disabled,
        searchValue,
        setSearchValue,
        toggleValue,
    } = context;

    const variantStyle =
        variant === "error"
            ? "border-rose-500 text-rose-600"
            : "border-slate-300 text-slate-800";

    const currentSelectedValuesArray = Array.from(selectedItems.keys());

    return (
        <div
            onClick={() => !disabled && setIsSelected(!isSelected)}
            className={cn(
                "h-10 w-full flex flex-wrap items-start gap-1 rounded-md px-3 py-2 border bg-white transition-all",
                "focus-within:ring-2 focus-within:ring-blue-500",
                "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                disabled && "bg-slate-100 text-slate-400 cursor-not-allowed",
                variantStyle,
                className
            )}
            {...props}
        >
            {type === "multiple" ? (
                <>
                {currentSelectedValuesArray.map((value: string) => (
                    <span
                        key={value}
                        className="flex items-center gap-1 bg-slate-200 text-slate-800 px-2 py-0.5 text-sm rounded"
                    >
                        {selectedItems.get(value)}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleValue(value);
                            }}
                            className="text-slate-500 hover:text-slate-800"
                        >
                            <SelectCloseIcon />
                        </button>
                    </span>
                ))}
                    <input
                        className={cn(
                            "flex-1 min-w-[60px] text-sm bg-transparent outline-none",
                            inputClassName
                        )}
                        placeholder={currentSelectedValuesArray.length === 0 ? placeholder : ""}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (!isSelected) setIsSelected(true);
                        }}
                    />
                </>
            ) : (
                <>
                    {/* Single 모드에서 선택된 값이 있고 Select가 닫혀있을 때만 선택된 값 표시 */}
                    {currentSelectedValuesArray.length > 0 && !isSelected && (
                        <span className="text-slate-800 text-sm pointer-events-none">
                            {selectedItems.get(currentSelectedValuesArray[0]) || currentSelectedValuesArray[0]}
                        </span>
                    )}
                    
                    {/* Single 모드에서도 검색 가능한 input */}
                    <input
                        className={cn(
                            "flex-1 text-sm bg-transparent outline-none",
                            // Select가 닫혀있고 선택된 값이 있을 때는 숨김
                            currentSelectedValuesArray.length > 0 && !isSelected && "opacity-0 absolute",
                            inputClassName
                        )}
                        placeholder={currentSelectedValuesArray.length === 0 || isSelected ? placeholder : ""}
                        value={isSelected ? searchValue : (currentSelectedValuesArray.length > 0 ? "" : "")}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (!isSelected) setIsSelected(true);
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) setIsSelected(true);
                        }}
                    />
                </>
            )}
        </div>
    );
};

const SelectContent = ({
                           className,
                           children,
                           ...props
                       }: React.ComponentProps<"ul">) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectContent는 Select 내부에서 사용해야 합니다.");

    const { isSelected, searchValue, variant } = context;
    if (!isSelected) return null;

    const filtered = React.Children.toArray(children).filter((child) => {
        if (React.isValidElement(child) && searchValue) {
            const { children } = child.props as SelectItemProps;
            return children?.toString().toLowerCase().includes(searchValue.toLowerCase());
        }
        return true;
    });

    return (
        <ul
            role="listbox"
            className={cn(
                "absolute z-50 mt-1 w-full max-h-48 rounded-md border bg-white shadow-md overflow-y-auto p-2 text-sm",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                variant === "error" ? "border-rose-500" : "border-slate-300",
                className
            )}
            {...props}
        >
            {filtered.length > 0 ? (
                filtered
            ) : (
                <li className="text-slate-400 px-2 py-1 text-center">검색 결과가 없습니다.</li>
            )}
        </ul>
    );
};

const SelectItem = ({
                        value,
                        className,
                        children,
                        ...props
                    }: SelectItemProps) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectItem은 Select 내부에서 사용해야 합니다.");

    const { selectedItems, setSelectedItems, toggleValue, variant } = context;
    const isItemSelected = selectedItems.has(value);

    useEffect(() => {
        setSelectedItems((prevSelectedItems: Map<string, React.ReactNode>): Map<string, React.ReactNode> => {
            if (prevSelectedItems.has(value)) {
                const currentStoredNode = prevSelectedItems.get(value);
                if (currentStoredNode !== children) {
                    const newMap = new Map(prevSelectedItems);
                    newMap.set(value, children);
                    return newMap;
                }
            }
            return prevSelectedItems;
        });
    }, [value, children, setSelectedItems]);

    const handleSelect = () => {
        toggleValue(value, children);
    };

    return (
        <li
            role="option"
            aria-selected={isItemSelected}
            className={cn(
                "px-3 py-2 cursor-pointer rounded-md transition-colors",
                "hover:bg-slate-100 text-slate-700 border-white border-[1px]",
                isItemSelected && "bg-slate-200 text-blue-600 font-medium border-white border-[1px]",
                variant === "error" && isItemSelected && "text-rose-600",
                className
            )}
            onClick={handleSelect}
            {...props}
        >
            {children}
        </li>
    );
};

export { Select, SelectTrigger, SelectContent, SelectItem };