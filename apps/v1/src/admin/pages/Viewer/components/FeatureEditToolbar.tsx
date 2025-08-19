import { useEffect, useCallback, memo, ReactElement } from 'react';
import { Button } from "@plug/ui";

type EditMode = 'translate' | 'rotate' | 'scale' | 'delete' | 'none';

interface FeatureEditToolbarProps {
  onTranslateMode: () => void;
  onRotateMode: () => void;
  onScaleMode: () => void;
  onDeleteMode: () => void;
  onExitEdit: () => void;
  currentMode: EditMode;
}

interface ToolbarButton {
  readonly mode: Exclude<EditMode, 'none'>;
  readonly label: string;
  readonly title: string;
  readonly icon: ReactElement;
  readonly onClick: () => void;
}

const MoveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 5H13V9H17V7L20 10L17 13V11H13V15H15L12 18L9 15H11V11H7V13L4 10L7 7V9H11V5H9L12 2Z"
          fill="currentColor"/>
  </svg>
);

const RotateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12C4 13.57 4.46 15.03 5.24 16.26L6.7 14.8C6.25 13.97 6 13 6 12C6 8.69 8.69 6 12 6ZM18.76 7.74L17.3 9.2C17.75 10.03 18 11 18 12C18 15.31 15.31 18 12 18V15L8 19L12 23V20C16.42 20 20 16.42 20 12C20 10.43 19.54 8.97 18.76 7.74Z"
          fill="currentColor"/>
  </svg>
);

const ScaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3V21H3V19H20V3H22ZM20 5H15V7H18.59L13 12.59L10.41 10L4 16.41L5.41 17.82L10.41 12.82L13 15.41L20 8.41V12H22V5H20Z"
          fill="currentColor"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
          fill="currentColor"/>
  </svg>
);

const FeatureEditToolbar = memo<FeatureEditToolbarProps>(({
                                                            onTranslateMode,
                                                            onRotateMode,
                                                            onScaleMode,
                                                            onDeleteMode,
                                                            onExitEdit,
                                                            currentMode
                                                          }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && currentMode !== 'none') {
      onExitEdit();
      return;
    }

    // Ctrl + 키 조합으로 단축키 처리
    if (event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case 't':
          event.preventDefault(); // 브라우저 기본 동작 방지
          onTranslateMode();
          break;
        case 'r':
          event.preventDefault(); // 브라우저 새로고침 방지
          onRotateMode();
          break;
        case 's':
          event.preventDefault(); // 브라우저 저장 방지
          onScaleMode();
          break;
        case 'd':
          event.preventDefault(); // 브라우저 북마크 추가 방지
          onDeleteMode();
          break;
      }
    }
  }, [currentMode, onExitEdit, onTranslateMode, onRotateMode, onScaleMode, onDeleteMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const toolbarButtons: ToolbarButton[] = [
    {
      mode: 'translate',
      label: '이동',
      title: '이동 모드 (Ctrl+T)',
      icon: <MoveIcon />,
      onClick: onTranslateMode
    },
    {
      mode: 'rotate',
      label: '회전',
      title: '회전 모드 (Ctrl+R)',
      icon: <RotateIcon />,
      onClick: onRotateMode
    },
    {
      mode: 'scale',
      label: '크기',
      title: '크기조절 모드 (Ctrl+S)',
      icon: <ScaleIcon />,
      onClick: onScaleMode
    },
    {
      mode: 'delete',
      label: '삭제',
      title: '삭제 모드 (Ctrl+D)',
      icon: <DeleteIcon />,
      onClick: onDeleteMode
    }
  ];

  const getButtonClassName = useCallback((mode: EditMode) => {
    const baseClasses = 'w-10 h-10 transition-all duration-200';
    const activeClasses = 'ring-2 ring-blue-500 ring-offset-1';
    const inactiveClasses = 'bg-white hover:bg-gray-50';

    return currentMode === mode
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  }, [currentMode]);
  const getModeMessage = () => {
    switch (currentMode) {
      case 'translate':
        return '이동 모드 활성화 중 - 객체를 드래그하여 위치를 변경하세요';
      case 'rotate':
        return '회전 모드 활성화 중 - 객체를 드래그하여 회전시키세요';
      case 'scale':
        return '크기조절 모드 활성화 중 - 객체를 드래그하여 크기를 조절하세요';
      case 'delete':
        return '삭제 모드 활성화 중 - 삭제할 객체를 클릭하세요';
      default:
        return null;
    }
  };

  const getActiveButtonName = () => {
    switch (currentMode) {
      case 'translate': return '이동';
      case 'rotate': return '회전';
      case 'scale': return '크기조절';
      case 'delete': return '삭제';
      default: return '';
    }
  };

  const isEditingActive = currentMode !== 'none';
  return (
    <>
      <div className="absolute top-3 right-4 z-10">
        <div className={`flex flex-row gap-2 p-2 transition-all duration-300 bg-transparent`}>
          {toolbarButtons.map(({ mode, title, icon, onClick }) => (
            <Button
              key={mode}
              variant={currentMode === mode ? 'default' : 'outline'}
              color={currentMode === mode ? 'primary' : 'default'}
              size="icon"
              onClick={onClick}
              className={`${getButtonClassName(mode)} group`}
              title={title}
              aria-label={title}
              aria-pressed={currentMode === mode}
            >
              {icon}
              <span className="absolute top-full mt-3 px-3 py-2 bg-white/80 backdrop-blur-md text-zinc-700 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">{title}</span>
            </Button>
          ))}
        </div>
      </div>
      {isEditingActive && (
        <div className={`absolute top-20 right-4 mb-2 p-3 border rounded-lg shadow-sm animate-pulse ${
          currentMode === 'delete'
            ? 'bg-red-50 border-red-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-ping ${currentMode === 'delete' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <span className={`text-sm font-medium ${currentMode === 'delete' ? 'text-red-800' : 'text-blue-800'}`}>
              {currentMode === 'delete' ? '삭제 모드 활성화' : '편집 모드 활성화'}
            </span>
          </div>
          <p className={`text-xs mt-1 ${currentMode === 'delete' ? 'text-red-600' : 'text-blue-600'}`}>
            {getModeMessage()}
          </p>
          <p className={`text-xs mt-1 ${currentMode === 'delete' ? 'text-red-500' : 'text-blue-500'}`}>
            ESC 키를 누르거나 {getActiveButtonName()} 버튼을 다시 클릭하여 모드를 종료하세요
          </p>
        </div>
      )}
    </>
  );
});

FeatureEditToolbar.displayName = 'FeatureEditToolbar';

export default FeatureEditToolbar;