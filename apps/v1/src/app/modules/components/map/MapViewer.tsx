import { useState, useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';
import type { MapViewerProps, FloorItem } from './types';
import FloorSelector from './FloorSelector';

const MapViewer = ({ modelPath, floors = [], onModelLoaded, onLoadError }: MapViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [floorSelectorItems, setFloorSelectorItems] = useState<FloorItem[]>([{ floorId: 'ALL', displayName: '전체층', sortingOrder: -1, objectName: 'ALL' }]);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const engineRef = useRef<any>(null);
    const isModelLoadedRef = useRef<boolean>(false);
    
    useEffect(() => {
        if (containerRef.current && !engineRef.current) {
            engineRef.current = new Px.Engine3D(containerRef.current);
        }
        
        return () => {
            if (engineRef.current) {
                engineRef.current = null;
                isModelLoadedRef.current = false;
            }
        };    
    }, []);    

    useEffect(() => {
        if (floors && floors.length > 0) {
            const hasAllFloor = floors.some(floor => floor.floorId === 'ALL');
            
            const floorsWithAll: FloorItem[] = hasAllFloor 
                ? floors
                : [
                    { floorId: 'ALL', displayName: '전체층', sortingOrder: -1, objectName: 'ALL' },
                    ...floors
                  ];
            
            floorsWithAll.sort((a, b) => b.sortingOrder - a.sortingOrder);
            setFloorSelectorItems(floorsWithAll);
        }
    }, [floors]);

    useEffect(() => {
        if (engineRef.current && modelPath) {
            try {               
                
                Px.Loader.LoadGltf(modelPath, () => {
                    isModelLoadedRef.current = true;
                    onModelLoaded?.();
                    Px.Poi.HideAllLine();
                });
            } catch (error) {
                console.error('3D 모델 로드 중 오류 발생:', error);
                onLoadError?.(error as Error);
            }
        }
    }, [modelPath]);        
    
    return (
        <>
            <FloorSelector 
                floors={floorSelectorItems} 
            />
            <div className="engine absolute inset-0 z-0">
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
