import type { BasePlaceMent } from '../types';

export interface SheetPortalProps {
    children: React.ReactNode;
}

export interface SheetProps extends React.ComponentProps<"div"> {
    isOpen: boolean;
    closeOnOverlayClick?: boolean; 
    closable?: boolean;
    overlay?: boolean;
    onClose?: () => void;
    position?: BasePlaceMent;
    children: React.ReactNode;
}

export interface SheetHeaderProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}

export interface SheetContentProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}

export interface SheetFooterProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}