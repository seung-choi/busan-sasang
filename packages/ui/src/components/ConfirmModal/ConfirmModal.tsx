import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { ConfirmModalProps } from './ConfirmModal.types';


export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  isDangerous = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmColor = isDangerous ? 'destructive' : 'primary';

  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        className="w-20"
        onClick={onClose}
      >
        {cancelText}
      </Button>
      <Button
        color={confirmColor}
        className="w-20"
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={title}
      footer={footer}
    >
      <div className="py-4">
        <p className="text-gray-700 whitespace-pre-line">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
