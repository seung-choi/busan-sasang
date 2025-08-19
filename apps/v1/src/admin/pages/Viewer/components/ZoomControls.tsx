import React, { useCallback, useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';
import type { ModelInfo } from '@plug/engine/dist/src/interfaces';

interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  hierarchies?: ModelInfo[];
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
                                                     onZoomIn,
                                                     onZoomOut,
                                                     onResetView,
                                                     hierarchies,
                                                     selectedFloor,
                                                     onFloorChange
                                                   }) => {
  const zoomAnimationRef = useRef<number | null>(null);
  const zoomFactorRef = useRef<number>(0);

  const animateZoom = useCallback(() => {
    if (zoomFactorRef.current !== 0) {
      const container = document.querySelector('.three-d-viewer-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const wheelEvent = new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          deltaY: zoomFactorRef.current > 0 ? -2 : 2,
          clientX: centerX,
          clientY: centerY
        });

        container.dispatchEvent(wheelEvent);
        zoomFactorRef.current *= 0.7;

        if (Math.abs(zoomFactorRef.current) < 0.1) {
          zoomFactorRef.current = 0;
          zoomAnimationRef.current = null;
        } else {
          zoomAnimationRef.current = requestAnimationFrame(animateZoom);
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (zoomAnimationRef.current !== null) {
        cancelAnimationFrame(zoomAnimationRef.current);
      }
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    if (zoomAnimationRef.current !== null) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    zoomFactorRef.current = 1;
    zoomAnimationRef.current = requestAnimationFrame(animateZoom);

    onZoomIn?.();
  }, [animateZoom, onZoomIn]);

  const handleZoomOut = useCallback(() => {
    if (zoomAnimationRef.current !== null) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    zoomFactorRef.current = -1;
    zoomAnimationRef.current = requestAnimationFrame(animateZoom);

    onZoomOut?.();
  }, [animateZoom, onZoomOut]);

  const handleResetView = () => {
    Px.Camera.ExtendView(1.0);
    onResetView?.();
  };

  const sortedFloors = React.useMemo(() => {
    if (!hierarchies) return [];
    return [...hierarchies].sort((a, b) => Number(b.floorId) - Number(a.floorId));
  }, [hierarchies]);

  const currentFloorIndex = React.useMemo(() => {
    if (!selectedFloor || !hierarchies) return -1;
    return sortedFloors.findIndex(floor => floor.floorId === selectedFloor);
  }, [selectedFloor, sortedFloors]);

  const goToUpperFloor = () => {
    if (currentFloorIndex > 0) {
      onFloorChange(sortedFloors[currentFloorIndex - 1].floorId);
    }
  };

  const goToLowerFloor = () => {
    if (currentFloorIndex < sortedFloors.length - 1) {
      onFloorChange(sortedFloors[currentFloorIndex + 1].floorId);
    }
  };

  const formatDisplayName = (floor: ModelInfo) => {
    return floor.displayName.replace(/\(.*\)/g, '');
  };

  const selectedFloorInfo = selectedFloor && hierarchies ?
    sortedFloors.find(f => f.floorId === selectedFloor) : null;

  return (
    <div className="fixed right-5 bottom-5 z-10 flex flex-col gap-2">
      <div className="flex flex-col items-center space-y-1 bg-white rounded-lg p-1 shadow-md border border-gray-100">
        <button
          onClick={goToUpperFloor}
          disabled={currentFloorIndex <= 0}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
            currentFloorIndex <= 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:text-primary-500'
          }`}
          title="위층으로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>

        {selectedFloorInfo && (
          <div className="w-7 h-7 flex items-center justify-center bg-primary-500 rounded-md text-xs font-bold text-white shadow-sm">
            {formatDisplayName(selectedFloorInfo)}
          </div>
        )}

        <button
          onClick={goToLowerFloor}
          disabled={currentFloorIndex >= sortedFloors.length - 1 || currentFloorIndex < 0}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
            currentFloorIndex >= sortedFloors.length - 1 || currentFloorIndex < 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:text-primary-500'
          }`}
          title="아래층으로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center space-y-1 bg-white rounded-lg p-1 shadow-md border border-gray-100">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-500 transition-colors"
          title="확대"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-500 transition-colors"
          title="축소"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
          </svg>
        </button>

        <button
          onClick={handleResetView}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-500 transition-colors"
          title="전체 보기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;