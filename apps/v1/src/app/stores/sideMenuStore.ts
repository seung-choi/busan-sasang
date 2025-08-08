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
  menuItems: MenuItemData[];
  isDevicePanelOpen: boolean;
  setActiveMenu: (menu: MenuItemData | null) => void;
  setMenuItems: (items: MenuItemData[]) => void;
  setIsDevicePanelOpen: (isOpen: boolean) => void;
  openMenuByDeviceId: (deviceId: string) => void;
  closeDevicePanel: () => void;
}

const useSideMenuStore = create<SideMenuState>((set, get) => ({
  activeMenu: null,
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
}));

export default useSideMenuStore;
