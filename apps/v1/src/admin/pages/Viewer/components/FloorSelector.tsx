import { memo, useMemo } from 'react';
import type { ModelInfo } from '@plug/engine/dist/src/interfaces';
import { AccordionIcon, Select } from '@plug/ui';

export const FloorSelector = memo(({
                                     hierarchies,
                                     selectedFloor,
                                     onFloorChange
                                   }: {
  hierarchies: ModelInfo[];
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}) => {
  const handleFloorSelect = (values: string[]) => {
    const floorId = values[0];
    if (floorId) {
      onFloorChange(floorId);
    }
  };

  const sortedFloors = useMemo(() => {
    return [...hierarchies].sort((a, b) => Number(b.floorId) - Number(a.floorId));
  }, [hierarchies]);

  const formatDisplayName = (floor: ModelInfo) => {
    return floor.displayName.replace(/\(.*\)/g, '');
  };

  const selectedFloorInfo = selectedFloor ?
    sortedFloors.find(f => f.floorId === selectedFloor) : null;

  return (
    <div className="flex items-center space-x-3 px-2 pt-4">
      <Select
        className="text-sm w-56"
        selected={selectedFloor ? [selectedFloor] : []}
        onChange={handleFloorSelect}
      >
        <div className="relative">
          <Select.Trigger className="bg-white shadow-sm border border-gray-200 rounded-md text-gray-800">
            <div className="flex items-center space-x-2">
              {selectedFloorInfo && (
                <>
                  <span className="w-6 h-6 flex items-center justify-center bg-primary-500 rounded-md text-xs font-medium text-white shadow-sm">
                    {formatDisplayName(selectedFloorInfo)}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {selectedFloorInfo.displayName.match(/\(.*\)/g)?.[0] ||
                      selectedFloorInfo.displayName}
                  </span>
                </>
              )}
            </div>
          </Select.Trigger>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-500">
            <AccordionIcon />
          </div>
        </div>

        <Select.Content className="max-h-80 overflow-y-auto bg-white shadow-lg border border-gray-200 rounded-md">
          {sortedFloors.map((floor) => (
            <Select.Item
              key={floor.floorId}
              value={floor.floorId}
              className={`py-2 px-3 ${selectedFloor === floor.floorId ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-md text-xs ${
                    selectedFloor === floor.floorId
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {formatDisplayName(floor)}
                </span>
                <span
                  className={`${
                    selectedFloor === floor.floorId
                      ? 'text-primary-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                <span className="text-gray-700 font-medium">
                    {floor.displayName.match(/\(.*\)/g)?.[0] ||
                      floor.displayName}
                  </span>
                </span>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
});