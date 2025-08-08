export interface TextareaProps extends React.ComponentProps<'textarea'> {
    ariaLabel?: string;
    resize?: "none" | "both" | "horizontal" | "vertical";
    invalid?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
