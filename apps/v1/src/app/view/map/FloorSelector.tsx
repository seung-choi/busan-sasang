import React, { useEffect, useState } from 'react';
import * as Px from '@plug/engine/src';
import type { FloorSelectorProps } from './types';
import useStationStore from '@plug/v1/app/stores/stationStore';

const FloorSelector: React.FC<FloorSelectorProps> = ({ 
  floors: floors = [], 
  onFloorChange 
}) => {
  const { currentFloor, setCurrentFloor } = useStationStore();
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFloor(currentFloor);
  }, [currentFloor]);

  const handleFloorChange = (floorId: string) => {
    if (floorId === selectedFloor) return;
    
    setSelectedFloor(floorId);
    setCurrentFloor(floorId);
    
    Px.Model.HideAll();
    
    if(floorId === 'ALL') {
      Px.Model.ShowAll();
      Px.Camera.ExtendView(1.0);
    } else {
      Px.Model.Show(floorId);
    }

    if (onFloorChange) {
      onFloorChange(floorId);
    }
  };

  return (
    <div className="w-16 fixed right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-l-md shadow-[-1px_0px_4px_2px_rgba(0,76,151,0.5)] bg-primary-900/20 backdrop-blur-md flex flex-col">
      <div className="flex w-full items-center relative">
        <div className="flex flex-col justify-around items-center w-full">
          {floors.map((floor, index) => {
            const isSelected = selectedFloor === floor.floorId;
            return (
              <div 
                key={`${floor.floorId}-${index}`} 
                className={`relative w-full transition-all duration-300 ${isSelected ? 'scale-105' : ''}`}
                onClick={() => handleFloorChange(floor.floorId)}
                onMouseEnter={() => setHoveredFloor(floor.floorId)}
                onMouseLeave={() => setHoveredFloor(null)}
              >
                {hoveredFloor === floor.floorId && (
                  <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 p-2 bg-primary-900/40 backdrop-blur-md rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.15)] z-20 whitespace-nowrap border border-white/30">
                    <div className="text-sm font-bold text-white px-1">{floor.displayName}</div>
                    <div
                      className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0
                      border-t-[4px] border-b-[4px] border-l-[4px] border-transparent border-l-white/30"
                    ></div>
                  </div>
                )}
                <div
                  className={`relative rounded-md py-3 px-1 cursor-pointer group transition-all duration-300 ${
                    isSelected 
                      ? 'bg-primary-800/40 shadow-[0_0_8px_rgba(0,120,255,0.3)]' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className={`text-sm text-center font-medium truncate ${
                    isSelected ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                  }`}>
                    {floor.displayName.split('(')[0] || 'ALL'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloorSelector;