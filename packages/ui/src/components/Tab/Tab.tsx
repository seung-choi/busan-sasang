import * as React from "react";
import { useState, useContext, createContext, useCallback, useId } from "react";
import { cn } from "../../utils/classname";
import type {
    TabProps,
    TabListProps,
    TabTriggerProps,
    TabContentProps,
    TabContextProps
} from "./Tab.types";

const TabContext = createContext<TabContextProps | undefined>(undefined);

const Tab = ({
    defaultValue,
    value,
    onValueChange,
    className,
    children,
    color = "primary",
    ...props
}: TabProps) => {
    const [isTabValue, setIsTabValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : isTabValue;
    const baseId = useId();

    const setCurrentValue = useCallback((value: string) => {
        if (!isControlled) {
            setIsTabValue(value);
        }
        onValueChange?.(value);
    }, [isControlled, onValueChange]);

    return(
        <TabContext.Provider value={{ currentValue, setCurrentValue, baseId, color }}>
            <div
                className={cn("w-full", className)}
                {...props}
            >   
                {children}
            </div>
        </TabContext.Provider>
    );
};

Tab.displayName = "Tab";

const TabList = React.memo(({
    color: propColor,
    className,
    children,
    ...props
}: TabListProps) => {
    const context = useContext(TabContext);
    
    if (!context) {
      throw new Error("TabList는 Tab 구성 요소 내에서 사용해야 합니다. <Tab.List>가 <Tab> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    
    const color = propColor || context.color || "primary";

    const elementProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabTrigger) {
            return React.cloneElement(child, {
                color,
            } as TabTriggerProps);
        }
        return child;
    });

    return(
        <div
            aria-orientation="horizontal"
            role="tablist"
            className={cn(
                "flex item-center gap-1 w-full",
                className 
            )}
            {...props}
        >
            {elementProps}
        </div>
    );
});

TabList.displayName = "TabList";

const TabTrigger = React.memo(({
    color = "primary",
    className,
    children,
    value,
    ...props
}: TabTriggerProps) => {
    const context = useContext(TabContext);
    
    if (!context) {
      throw new Error("TabTrigger는 Tab 구성 요소 내에서 사용해야 합니다. <Tab.Trigger>가 <Tab> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    const { currentValue, setCurrentValue, baseId } = context;
    const isActive = currentValue === value;
    
    const triggerId = `${baseId}-trigger-${value}`;
    const contentId = `${baseId}-content-${value}`;
    
    const handleClick = () => {
        setCurrentValue(value);
    };
   
    return(
        <button
            id={triggerId}
            aria-selected={isActive}
            aria-controls={contentId}
            role="tab"
            type="button"
            onClick={handleClick}
            className={cn(
                "inline-flex item-center justify-center w-full px-3 py-2 cursor-pointer font-semibold text-gray-600 border-b-2",
                isActive ? "border-b-2" : "border-transparent",
                "transition-all ease-in-out duration-300",
                isActive && color === "primary" && "text-primary-500 border-primary-500",
                isActive && color === "secondary" && "text-secondary-500 border-secondary-500",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

TabTrigger.displayName = "TabTrigger";

const TabContent = React.memo(({
    className,
    children,
    value,
    ...props
}: TabContentProps) => {
    const context = useContext(TabContext);
    
    if (!context) {
      throw new Error("TabContent는 Tab 구성 요소 내에서 사용해야 합니다. <Tab.Content>가 <Tab> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    const { currentValue, baseId } = context;
    const isActive = currentValue === value;
    
    const contentId = `${baseId}-content-${value}`;
    const triggerId = `${baseId}-trigger-${value}`;
    
    return(
        <div
            id={contentId}
            aria-hidden={!isActive}
            aria-labelledby={triggerId}
            role="tabpanel"
            className={cn(
                "mt-3 transition-all ease-in-out duration-300",
                isActive ? "block" : "hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

TabContent.displayName = "TabContent";

export { Tab, TabList, TabTrigger, TabContent };