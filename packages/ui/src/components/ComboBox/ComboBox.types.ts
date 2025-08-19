export interface ComboBoxProps extends Omit<React.ComponentProps<"div">, 'onChange'>{
    onChange?: (value: string) => void;
    disabled?: boolean; 
    selected?: string;
}

export interface ComboBoxTriggerProps extends React.ComponentProps<"div">{
    placeholder?: string;
    inputClassName?: string;
}

export interface ComboBoxContentProps extends React.ComponentProps<"ul">{
    inputClassName?: string;
}

export interface ComboBoxItemProps extends React.ComponentProps<"li">{
    value: string;
}