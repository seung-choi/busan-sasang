import React from 'react';

export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} 