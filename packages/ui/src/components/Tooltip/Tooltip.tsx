import { cn } from "../../utils/classname";
import { useState, createContext, useContext } from "react";
import type { 
    TooltipProps,
 } from "./Tooltip.types";

interface TooltipContextProps{
    isActive: boolean;
    setIsActive: (value: boolean) => void;
    position: 'top' | 'right' | 'bottom' | 'left';
    trigger: 'hover' | 'focus' | 'touch';
}

const TooltipContext = createContext<TooltipContextProps | undefined>(undefined);

const Tooltip = ({
    trigger = "hover",
    position = "top",
    className,
    children,
}: TooltipProps) => {

    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const TooltipStyle = "relative inline-block z-9999 overflow-visible"

    return (
        <TooltipContext.Provider value={{ isActive:isTooltipOpen, setIsActive:setIsTooltipOpen, trigger, position }}>
            <div className={cn(TooltipStyle, className)}>{children}</div>
        </TooltipContext.Provider>
    )
}

Tooltip.displayName = "Tooltip";

const TooltipTrigger = ({
    className,
    children,
    ...props
}: React.ComponentProps<'div'>) => {
    
    const context = useContext(TooltipContext);

    if (!context) {
        throw new Error("TooltipTrigger는 Tooltip 구성 요소 내에서 사용해야 합니다. <Tooltip.Trigger>이 <Tooltip> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }

    const { setIsActive, trigger } = context;

    const HoverEvent = trigger === 'hover';
    const FocusEvent = trigger === 'focus';
    const TouchEvent = trigger === 'touch';

    const TooltipTriggerStyle = "inline-flex items-center justify-center cursor-pointer"

    return (
        <div 
            className={cn(
                TooltipTriggerStyle,
                className,
            )}
            onTouchStart={TouchEvent ? () => setIsActive(true) : undefined}
            onTouchEnd={TouchEvent ? () => setIsActive(false) : undefined}
            onMouseEnter={HoverEvent ? () => setIsActive(true) : undefined}
            onMouseLeave={HoverEvent ? () => setIsActive(false) : undefined}
            onFocus={FocusEvent ? () => setIsActive(true) : undefined}
            onBlur={FocusEvent ? () => setIsActive(false) : undefined}
            tabIndex={0}
            {...props}
        >
            {children}
        </div>
    )
}

TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = ({
    children,
    className,
    ...props
}: React.ComponentProps<'div'>) => {

    const context = useContext(TooltipContext);

    if (!context) {
        throw new Error("TooltipContent는 Tooltip 구성 요소 내에서 사용해야 합니다. <Tooltip.Content>이 <Tooltip> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }

    const { isActive, position } = context;

    if (!isActive) {
        return null;
    }

    const TooltipContentStyle = `absolute text-white text-sm rounded shadow bg-black py-2 px-3 transition-all duration-300 ease-in-out z-999
        min-w-[120px] text-center whitespace-nowrap after:absolute after:w-2 after:h-2 after:bg-black after:rotate-45 after:content-['']
        ${isActive ? "opacity-100" : "opacity-0"}
        ${position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-4 after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2" : ""}
        ${position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-4 after:top-[-4px] after:left-1/2 after:-translate-x-1/2" : ""}
        ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-4 after:right-[-4px] after:top-1/2 after:-translate-y-1/2" : ""}
        ${position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-4 after:left-[-4px] after:top-1/2 after:-translate-y-1/2" : ""}
    `;

    return (
        <div 
            role="tooltip"
            className={cn(
                TooltipContentStyle,
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent }