import { useState } from 'react';

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const openModal = (mode: 'create' | 'edit') => {
        setMode(mode);
        setIsOpen(true);
    };

    return {
        isOpen,
        mode,
        openModal,
        closeModal: () => setIsOpen(false)
    };
};