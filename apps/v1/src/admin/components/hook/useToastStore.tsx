import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ToastPlacement } from '@plug/ui';

type ToastVariant = 'default' | 'normal' | 'caution' | 'warning' | 'critical';

interface ToastItem {
  id: string;
  title?: string;
  description: string;
  placement?: ToastPlacement;
  variant: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = uuidv4();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));