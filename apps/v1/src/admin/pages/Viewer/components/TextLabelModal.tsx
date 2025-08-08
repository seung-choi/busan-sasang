import React, { useState, useCallback, memo } from 'react';

interface TextLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLabel: (text: string) => void;
}

export const TextLabelModal = memo(({ 
  isOpen, 
  onClose, 
  onCreateLabel 
}: TextLabelModalProps) => {
  const [labelText, setLabelText] = useState('');

  const handleCreate = useCallback(() => {
    if (labelText.trim()) {
      onCreateLabel(labelText.trim());
      setLabelText('');
      onClose();
    }
  }, [labelText, onCreateLabel, onClose]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  }, [handleCreate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">3D 텍스트 라벨 생성</h2>
        <div className="mb-4">
          <label htmlFor="labelText" className="block text-sm font-medium text-gray-700 mb-2">
            텍스트 내용
          </label>
          <input
            id="labelText"
            type="text"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="표시할 텍스트를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!labelText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
});

TextLabelModal.displayName = 'TextLabelModal';
