import {
    Sidebar as SidebarComponent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSubMenu,
    SidebarSubMenuItem,
} from "./Sidebar";

import type{
    SidebarProps,
    SidebarMenuProps,
    SidebarMenuButtonProps,
    SidebarMenuItemProps,
    SidebarSubMenuProps,
    SidebarSubMenuItemProps,
} from './Sidebar.types';

const Sidebar = Object.assign(SidebarComponent, {
    Header: SidebarHeader,
    Footer: SidebarFooter,
    Menu: SidebarMenu,
    MenuItem: SidebarMenuItem,
    MenuButton: SidebarMenuButton,
    SubMenu: SidebarSubMenu,
    SubMenuItem: SidebarSubMenuItem,
});

export { Sidebar };

export { SidebarProps, SidebarMenuProps, SidebarMenuButtonProps, SidebarMenuItemProps, SidebarSubMenuProps, SidebarSubMenuItemProps }