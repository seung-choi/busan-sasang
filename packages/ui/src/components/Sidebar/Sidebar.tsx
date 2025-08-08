import { cn } from "../../utils/classname";
import React, {useState, useContext, createContext} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import SidebarArrowIcon from "../../assets/icons/sidebar_arrow.svg";
import type {
    SidebarProps,
    SidebarHeaderProps,
    SidebarFooterProps,
    SidebarMenuButtonProps,
    SidebarMenuProps,
    SidebarMenuItemProps,
    SidebarSubMenuProps,
    SidebarSubMenuItemProps,
} from "./Sidebar.types";

interface SidebarContextType {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const Sidebar = ({
    isOpen = true,
    onChange,
    className,
    children,
    ...props
}: SidebarProps) => {
    const isControlled = isOpen !== undefined;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentState = isControlled ? isOpen : sidebarOpen;

    const toggleSidebar = () => {
        if(!isControlled){
            setSidebarOpen(currentState);
        }
        if(onChange){
            onChange(currentState);
        }
    }
    
    return (
        <SidebarContext value={{ isOpen:currentState, toggleSidebar }}>
            <aside
                aria-hidden={!currentState}
                className={cn(
                    'h-screen flex flex-col',
                    'bg-gradient-to-b from-white to-gray-50/80',
                    'backdrop-blur-md',
                    'border-r border-gray-100/50',
                    'shadow-[0_0_30px_-10px_rgba(0,0,0,0.15)]',
                    currentState ? 'w-64' : 'w-20',
                    'transition-all duration-300 ease-in-out',
                    className

                )}
                {...props}
            >
                <div className="flex-1 overflow-y-auto p-3 flex flex-col">
                    {children}
                </div>
            </aside>
        </SidebarContext>
    );
}

const SidebarHeader = ({
    className,
    children,
    ...props
}: SidebarHeaderProps) => {
    const { isOpen } = useContext(SidebarContext)!;
    if (!isOpen) return null;

    return(
        <div
            className={cn("p-3 mb-2", className)}
            {...props}
        >
            {children}
        </div>
    )
}

const SidebarFooter = ({
    className,
    children,
    ...props
}: SidebarFooterProps) => {
    const { isOpen } = useContext(SidebarContext)!;
    if (!isOpen) return null;
    
    return(
        <div
            className={cn("p-3 mt-2", className)}
            {...props}
        >
            {children}
        </div>
    )
}

const SidebarMenu = ({
    className,
    items = [],
    ...props
}: SidebarMenuProps) => {
    return(
        <ul
            className={cn(
                `flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2 font-bold text-gray-700
                [&::-webkit-scrollbar]:w-[4px]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-200/70
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/70`,
                className
            )}
            {...props}
        >
            {items.map((item, index) => (
                <SidebarMenuItem key={index} toggleable={item.toggleable}>
                    <SidebarMenuButton link={item.link} className={item.className} beforeNavigate={item.beforeNavigate}>
                        {item.icon}
                        {item.title}
                    </SidebarMenuButton>
                    {item.submenu && (
                        <SidebarSubMenu>
                            {item.submenu.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                    <SidebarSubMenuItem link={subItem.link} className={subItem.className} beforeNavigate={subItem.beforeNavigate}>
                                        {subItem.title}
                                    </SidebarSubMenuItem>
                                </li>
                            ))}
                        </SidebarSubMenu>
                    )}
                </SidebarMenuItem>
            ))}
        </ul>
    )
}

const SidebarMenuItem = ({
    toggleable = true,
    className,
    children,
    ...props
}: SidebarMenuItemProps) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    
    const handleClick = () => {
        if (toggleable) {
            setIsSubMenuOpen(prev => !prev);
        }
    };

    const ChildrenElement = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            if (child.type === SidebarMenuButton) {
                return React.cloneElement(child, {
                    isSubMenuOpen,
                    onClick: () => {handleClick();},
                } as SidebarMenuButtonProps);
            }
            if (child.type === SidebarSubMenu) {
                return React.cloneElement(child, {
                    isSubMenuOpen,
                } as SidebarSubMenuProps);
            }
        }
        return child;
    });

    return(
        <li
            className={cn(className)}
            {...props}
        >   
            {ChildrenElement}
        </li>
    )
}

const SidebarMenuButton = ({
    className,
    children,
    beforeNavigate,
    isSubMenuOpen = false,
    onClick,
    link,
    ...props
}: SidebarMenuButtonProps) => {
    const { isOpen } = useContext(SidebarContext)!;
    const ArrowIcon = SidebarArrowIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
    const navigate = useNavigate(); 

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if(beforeNavigate){
            beforeNavigate();
        }
        if (link) {
            navigate(link);
        }
    };

    const SubChildrenElement = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {return child;}
        if (typeof child === 'string') {return isOpen ? child : null;}
        return null;
    });

    return (
        <button
            onClick={handleClick}
            className={cn(
                'group flex items-center w-full',
                'px-4 py-2 rounded-xl',
                isOpen ? 'gap-3' : 'justify-center',
                'text-[15px] tracking-wide',
                'transition-all duration-200 ease-out',
                link && location.pathname.includes(link) ? [
                    'bg-white text-[var(--color-primary-700)]',
                    'shadow-sm shadow-[var(--color-primary-200)]/50',
                ].join(' ') : (
                    [
                        'text-gray-600',
                        'hover:bg-white/60 hover:text-[var(--color-primary-700)]',
                        'hover:shadow-sm hover:shadow-gray-100/50',
                        'active:bg-white/80'
                    ].join(' ')
                ),
                className
            )}
            {...props}
        >
            {SubChildrenElement}
            {isOpen && (
                <ArrowIcon className={cn(
                    "ml-auto transition-transform duration-200",
                    isSubMenuOpen ? "rotate-90" : "rotate-0"
                )}/>
            )}
        </button>
    )
}

const SidebarSubMenu = ({
    className,
    children,
    isSubMenuOpen = false,
    ...props
}: SidebarSubMenuProps) => {
    return(
        <ul
            role="menu"
            aria-hidden={!isSubMenuOpen}
            className={cn(
                'flex flex-col',
                'pl-4 ml-2',
                'border-l border-gray-100/70',
                'overflow-hidden transition-all duration-300 ease-out',
                isSubMenuOpen ? [
                    'max-h-[500px] opacity-100 my-2.5',
                    'gap-1'
                ].join(' ') : [
                    'max-h-0 opacity-0 my-0',
                    'gap-0'
                ].join(' '),
                className

            )}
            {...props}
        >   
            {children}
        </ul>
    )
}

const SidebarSubMenuItem = ({
                                className,
                                children,
                                onClick,
                                beforeNavigate,
                                link,
                                ...props
                            }: SidebarSubMenuItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if(beforeNavigate){
            beforeNavigate();
        }
        if (link) {
            navigate(link);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                'w-full text-left relative',
                'px-4 py-2 rounded-lg',
                'text-[13px] font-medium',
                'transition-all duration-200 ease-out',
                link && location.pathname.includes(link)  ? [
                    'bg-[var(--color-primary-200)]',
                    'text-[var(--color-primary-700)]',
                    'shadow-sm shadow-[var(--color-primary-100)]/50'
                ].join(' ') : (
                    [
                        'text-gray-500',
                        'hover:bg-white/80',
                        'hover:text-gray-900',
                        'hover:shadow-sm hover:shadow-gray-100/50'
                    ].join(' ')
                ),
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {link && location.pathname.includes(link) && (
                    <span className="w-1 h-1 rounded-full bg-[var(--color-primary-500)]" />
                )}
                {children}
            </span>
        </button>

    )
}

export { Sidebar, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSubMenu, SidebarSubMenuItem };