import { useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';

export interface MapViewerProps {
  modelPath: string;
  onModelLoaded?: () => void;
}
const MapViewer = ({ modelPath, onModelLoaded }: MapViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const engineRef = useRef<any>(null);
    const isModelLoadedRef = useRef<boolean>(false);

    // 엔진 초기화
    useEffect(() => {
        if (containerRef.current && !engineRef.current) {
            engineRef.current = new Px.Engine3D(containerRef.current);
        }
        
        // 컴포넌트 언마운트 시 정리
        return () => {
            if (engineRef.current) {
                engineRef.current = null;
                isModelLoadedRef.current = false;
            }
        };
    }, []);


    // 모델 로드
    useEffect(() => {
        if (engineRef.current && modelPath && !isModelLoadedRef.current) {
            try {
                Px.Loader.LoadGltf(modelPath, () => {
                    isModelLoadedRef.current = true;
                    Px.Poi.HideAllLine();
                    onModelLoaded?.();
                });
            } catch (error) {
                console.error('3D 모델 로드 중 오류 발생:', error);
            }
        }
    }, [modelPath, onModelLoaded]);

    return (
      <>
        <div className="engine w-full h-full inset-0 z-0">
          <div
            ref={containerRef}
            className="three-d-viewer-container"
            style={{
              width: '100%',
              height: '100vh',
            }}
          />
        </div>
      </>
    );
};

export default MapViewer;