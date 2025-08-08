
type DropdownType = 'single' | 'multiple';
type DropdownVariant = 'default' | 'error'; 

export interface DropdownProps extends Omit<React.ComponentProps<'div'>, 'onChange'>{
    variant?: DropdownVariant;
    selected?: string[];
    onChange?: (values: string[]) => void;
    type?: DropdownType;
    disabled?: boolean;
    children? : React.ReactNode;
}

export interface DropdownItemProps extends React.ComponentProps<'li'>{
    value: string;
}

