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
  const [isHovered, setIsHovered] = useState(false);

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

  return (    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-l-md shadow-[-1px_0px_4px_2px_rgba(0,76,151,0.5)] bg-primary-900/20 backdrop-blur-md">
      <div className="flex items-center">        
        <div className="w-9 flex flex-col justify-around items-center gap-6 py-2">
          {floors.map((floor, index) => (
            <div key={`${floor.floorId}-${index}`} className="relative">
              {isHovered && (
                <div className="absolute right-full mr-8 -mt-3 p-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg z-20 whitespace-nowrap border-primary-900 border">
                  <div className="text-xs font-bold text-primary-900 px-1">{floor.displayName}</div>
                  <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 
                    border-t-[4px] border-b-[4px] border-l-[4px] border-transparent border-l-primary-900"></div>
                </div>
              )}
              
              <div 
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200
                  ${selectedFloor === floor.floorId
                    ? 'bg-primary-900 hover:bg-primary-800'
                    : 'bg-white/80 hover:bg-white'}`}
                onClick={() => handleFloorChange(floor.floorId)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorSelector;