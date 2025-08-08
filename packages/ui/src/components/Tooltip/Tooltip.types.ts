import type { BasePlaceMent } from '../types';

type TooltipTrigger = 'hover' | 'focus' | 'touch';

export interface TooltipProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    isActive?: boolean;
    children: React.ReactNode;
    trigger?: TooltipTrigger;
    position?: BasePlaceMent;
}