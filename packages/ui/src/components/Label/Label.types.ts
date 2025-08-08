
import type { Color, Size } from '../types'

export interface LabelProps extends React.ComponentProps<'label'> {
    color?: Color;
    required?: boolean;
    size?: Size;
}