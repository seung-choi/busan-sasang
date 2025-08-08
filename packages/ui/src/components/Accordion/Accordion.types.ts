export interface AccordionProps{
    type?: "single" | "multiple";
    collapsible?: boolean;
    onChange?: (value: string) => void;
    className?: string
    children?: React.ReactNode;
}

export interface AccordionItemProps extends React.ComponentProps<'div'>{
    value: string;
    disabled?: boolean;
    isOpen?: boolean; 
    onToggle?: () => void;
    children?: React.ReactNode;
}

export interface AccordionTriggerProps extends React.ComponentProps<'button'> {
    isOpen?: boolean;
    disabled?: boolean;
    onToggle?: () => void; 
    children?: React.ReactNode;
}

export interface AccordionContentProps extends React.ComponentProps<'div'> {
    isOpen?: boolean; 
    children?: React.ReactNode;
} 