import { create } from 'zustand';

interface DeviceData {
  id: string;
  name: string;
  code: string;
  feature: {
    id: string;
    floorId: string;
    assetId: string;
  };
}

interface MenuItemData {
  id: string;
  name: string;
  type: string;
  icon: string;
  devices: DeviceData[];
}

interface SideMenuState {
  activeMenu: MenuItemData | null;
  selectedMenus: MenuItemData[];
  menuItems: MenuItemData[];
  isDevicePanelOpen: boolean;

  setActiveMenu: (menu: MenuItemData | null) => void;
  setMenuItems: (items: MenuItemData[]) => void;
  setIsDevicePanelOpen: (isOpen: boolean) => void;
  openMenuByDeviceId: (deviceId: string) => void;
  closeDevicePanel: () => void;

  addSelectedMenu: (menu: MenuItemData) => void;
  removeSelectedMenu: (menuId: string) => void;
  toggleSelectedMenu: (menu: MenuItemData) => void;
}

const useSideMenuStore = create<SideMenuState>((set, get) => ({
  activeMenu: null,
  selectedMenus: [],
  menuItems: [],
  isDevicePanelOpen: false,
  
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setMenuItems: (items) => set({ menuItems: items }),
  setIsDevicePanelOpen: (isOpen) => set({ isDevicePanelOpen: isOpen }),
    openMenuByDeviceId: (deviceId) => {
    const { menuItems } = get();
    
    const targetMenu = menuItems.find(menu => 
      menu.devices.some(device => {
        const deviceIdMatch = device.id === deviceId || device.id === String(deviceId) || String(device.id) === String(deviceId);
        return deviceIdMatch;
      })
    );
    
    if (targetMenu) {
      set({ 
        activeMenu: targetMenu,
        isDevicePanelOpen: true 
      });
    }
  },
  closeDevicePanel: () => set({ 
    activeMenu: null, 
    isDevicePanelOpen: false 
  }),
  addSelectedMenu: (menu) => {
    const { selectedMenus } = get();
    const exists = selectedMenus.some(m => m.id === menu.id);
    if (!exists) {
      set({ selectedMenus: [...selectedMenus, menu] });
    }
  },

  removeSelectedMenu: (menuId) => {
    const { selectedMenus } = get();
    set({ selectedMenus: selectedMenus.filter(m => m.id !== menuId) });
  },

  toggleSelectedMenu: (menu) => {
    const { selectedMenus } = get();
    const exists = selectedMenus.some(m => m.id === menu.id);
    if (exists) {
      set({ selectedMenus: selectedMenus.filter(m => m.id !== menu.id) });
    } else {
      set({ selectedMenus: [...selectedMenus, menu] });
    }
  },

}));

export default useSideMenuStore;
