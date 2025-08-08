import { useState, useCallback, useEffect } from 'react';
import * as Px from '@plug/engine/src';

export type EditMode = 'translate' | 'rotate' | 'scale' | 'delete' | 'none';

export interface UseEditModeResult {
  currentMode: EditMode;
  setTranslateMode: () => void;
  setRotateMode: () => void;
  setScaleMode: () => void;
  setDeleteMode: () => void;
  exitEdit: () => void;
}

export function useEditMode(): UseEditModeResult {
  const [currentMode, setCurrentMode] = useState<EditMode>('none');

  const exitEdit = useCallback(() => {
    setCurrentMode('none');
    Px.Poi.FinishEdit();
    Px.Label3D.FinishEdit();
  }, []);

  const setTranslateMode = useCallback(() => {
    if (currentMode === 'translate') {
      exitEdit();
    } else {
      setCurrentMode('translate');
      Px.Poi.StartEdit('translate');
      Px.Label3D.StartEdit('translate');
    }
  }, [currentMode, exitEdit]);

  const setRotateMode = useCallback(() => {
    if (currentMode === 'rotate') {
      exitEdit();
    } else {
      setCurrentMode('rotate');
      Px.Poi.StartEdit('rotate');
      Px.Label3D.StartEdit('rotate'); 
    }
  }, [currentMode, exitEdit]);
  const setScaleMode = useCallback(() => {
    if (currentMode === 'scale') {
      exitEdit();
    } else {
      setCurrentMode('scale');
      Px.Poi.StartEdit('scale');
      Px.Label3D.StartEdit('scale');
    }
  }, [currentMode, exitEdit]);

  const setDeleteMode = useCallback(() => {
    if (currentMode === 'delete') {
      exitEdit();
    } else {
      setCurrentMode('delete');
    }
  }, [currentMode, exitEdit]);

  // ESC 키 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && currentMode !== 'none') {
        exitEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMode, exitEdit]);
  return {
    currentMode,
    setTranslateMode,
    setRotateMode,
    setScaleMode,
    setDeleteMode,
    exitEdit,
  };
}
