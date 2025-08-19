export interface SidebarMenuItemData {
    id?: string;
    title?: string;
    toggleable?: boolean;
    link?: string;
    icon?: React.ReactNode;
    className?: string;
    beforeNavigate?: () => void;
    submenu?: Array<SidebarSubMenuItemData>;
}

export interface SidebarSubMenuItemData {
    id?: string;
    title?: string;
    link?: string;
    className?: string;
    beforeNavigate?: () => void;
}

export interface SidebarProps extends Omit<React.ComponentProps<'aside'>, 'onChange'> {
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    children?: React.ReactNode;
}

export interface SidebarHeaderProps extends React.ComponentProps<'div'>{}
export interface SidebarFooterProps extends React.ComponentProps<'div'>{}

export interface SidebarMenuProps extends React.ComponentProps<'ul'> {
    className?: string;
    toggleable?: boolean;
    items?: Array<SidebarMenuItemData>;
}

export interface SidebarMenuItemProps extends React.ComponentProps<'li'> {
    toggleable?: boolean;
    beforeNavigate?: () => void;
    link?: string;
    icon?: React.ReactNode;
    title?: string;
}

export interface SidebarMenuButtonProps extends React.ComponentProps<'button'> {
    isSubMenuOpen?: boolean;
    link?: string;
    beforeNavigate?: () => void;
}

export interface SidebarSubMenuProps extends React.ComponentProps<'ul'> {
    isSubMenuOpen?: boolean;
}

export interface SidebarSubMenuItemProps extends React.ComponentProps<"button"> {
    link?: string;
    beforeNavigate?: () => void;
}
