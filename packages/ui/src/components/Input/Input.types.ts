import { InputHTMLAttributes } from 'react'
import { FormFieldProps } from '../Form'

export interface InputProps<T = string>
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>,
        Partial<FormFieldProps<T>> {
    id?: string
    type?: 'text' | 'number' | 'password' | 'email' | 'tel'
    iconPosition?: 'leading' | 'trailing'
    iconSvg?: string | React.FC<React.SVGProps<SVGSVGElement>>
    renderIcon?: (props: { iconColor: string; isFocused: boolean }) => React.ReactNode
    invalid?: boolean
    className?: string
    ariaLabel?: string
}

export interface InputHelperTextProps extends React.ComponentProps<'p'> {
    error?: boolean;
}