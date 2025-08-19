import * as React from "react";
import { useState, useRef, useEffect, useId } from "react";
import { cn } from '../../utils/classname';
import AccordionIcon from '../../assets/icons/accordion.svg';
import type {
    AccordionProps,
    AccordionItemProps,
    AccordionTriggerProps,
    AccordionContentProps
} from './Accordion.types';

const Accordion = React.memo(({
                                  type = "single",
                                  collapsible = false,
                                  onChange,
                                  className,
                                  children,
                                  ...props
                              }: AccordionProps) => {
    const [accordionState, setAccordionState] = useState<Set<string>>(new Set());

    const accordionUpdate = (value: string) => {
        setAccordionState(prev => {
            const next = new Set(prev);
            if (type === "single") {
                if (next.has(value)) {
                    if (collapsible) next.delete(value);
                } else {
                    next.clear();
                    next.add(value);
                }
            } else {
                if (next.has(value)) next.delete(value);
                else next.add(value);
            }
            onChange?.(value);
            return next;
        });
    };

    const elementProps = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === AccordionItem) {
            const props = child.props as AccordionItemProps;
            return React.cloneElement(child, {
                isOpen: accordionState.has(props.value),
                onToggle: () => accordionUpdate(props.value),
                isLast: index === React.Children.count(children) - 1
            } as AccordionItemProps & { isLast: boolean });
        }
        return child;
    });

    return (
        <div
            className={cn("flex flex-col divide-y divide-slate-200 bg-white rounded-md border border-slate-200", className)}
            {...props}
        >
            {elementProps}
        </div>
    );
});
Accordion.displayName = 'Accordion';

const AccordionItem = React.memo(({
                                      disabled = false,
                                      isOpen = false,
                                      onToggle,
                                      className,
                                      children,
                                      isLast = false,
                                      ...props
                                  }: AccordionItemProps & { isLast?: boolean }) => {
    const uniqueId = useId();
    const buttonId = `button-${uniqueId}`;
    const contentId = `content-${uniqueId}`;

    const elementProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            if (child.type === AccordionTrigger) {
                return React.cloneElement(child, {
                    isOpen,
                    disabled,
                    id: buttonId,
                    "aria-controls": contentId,
                    onToggle
                } as AccordionTriggerProps);
            }
            if (child.type === AccordionContent) {
                return React.cloneElement(child, {
                    isOpen,
                    id: contentId,
                    "aria-labelledby": buttonId
                } as AccordionContentProps);
            }
        }
        return child;
    });

    return (
        <div
            className={cn(
                "transition-colors",
                !isLast && "border-b border-slate-200",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {elementProps}
        </div>
    );
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.memo(({
                                         isOpen = false,
                                         disabled = false,
                                         onToggle,
                                         className,
                                         children,
                                         ref,
                                         ...props
                                     }: AccordionTriggerProps) => {
    return (
        <button
            ref={ref}
            type="button"
            aria-expanded={isOpen}
            aria-disabled={disabled}
            onClick={!disabled ? onToggle : undefined}
            className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800 transition-all hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                disabled && "cursor-not-allowed",
                className
            )}
            {...props}
        >
            <span>{children}</span>
            <span
                className={cn(
                    "ml-2 transition-transform duration-300",
                    isOpen ? "rotate-180" : "rotate-0"
                )}
            >
        <AccordionIcon />
      </span>
        </button>
    );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.memo(({
                                         isOpen = false,
                                         className,
                                         children,
                                         ref,
                                         ...props
                                     }: AccordionContentProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, []);

    return (
        <div
            ref={ref}
            role="region"
            className={cn(
                "overflow-hidden bg-slate-50 text-sm text-slate-700 transition-all",
                className
            )}
            style={{
                maxHeight: isOpen ? `${contentHeight + 32}px` : '0',
                transitionDuration: isOpen ? '600ms' : '300ms',
                transitionTimingFunction: isOpen ? 'ease-out' : 'ease-in-out',
                willChange: 'max-height'
            }}
            {...props}
        >
            <div ref={contentRef} className="px-4 py-4">
                {children}
            </div>
        </div>
    );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
