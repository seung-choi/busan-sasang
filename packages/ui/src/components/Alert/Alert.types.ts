import type { DialogProps } from '@plug/ui';

export interface AlertProps extends DialogProps {
    variant?: 'default' | 'success' | 'error' | 'notice' | 'info';
    className?: string;
}