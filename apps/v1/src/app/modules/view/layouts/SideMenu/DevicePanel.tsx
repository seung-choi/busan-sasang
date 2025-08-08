import React from 'react';
import * as Px from '@plug/engine/src';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useDeviceModalStore from '@plug/v1/app/stores/deviceModalStore';

interface DeviceData {
  id: string;
  name: string;
  code: string;
  feature: DeviceFeature;
}

interface DeviceFeature {
  id: string;
  floorId: string;
  assetId: string;
}

interface DevicePanelProps {
  categoryId: string | null;
  categoryType: string;
  categoryName: string | null;
  devices: DeviceData[];
  onClose: () => void;
}

const DevicePanel: React.FC<DevicePanelProps> = ({ 
  categoryId, 
  categoryType, 
  categoryName, 
  devices = [],
  onClose 
}) => {
  const { externalCode, setCurrentFloor } = useStationStore();
  const { openModal } = useDeviceModalStore();
  
  const handleDeviceClick = (device: DeviceData) => {
    try {
      if (device.feature.id && device.feature.floorId) {
        setCurrentFloor(device.feature.floorId);
        
        Px.Model.HideAll();
        Px.Model.Show(device.feature.floorId);
        Px.Camera.MoveToPoi(device.feature.id, 1.0);
      } 
    } catch (error) {
      console.error('이동 중 오류 발생:', error);
    }
  };

  if (!categoryId) {
    return null;
  }

  return (
    <>
      <div className="fixed left-16 top-16 bottom-0 w-72 bg-gradient-to-b from-primary-900/20 to-primary-900/5 backdrop-blur-lg p-4 z-20 transition-all duration-300 ease-in-out transform translate-x-0 border-r border-gray-100/10">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100/20 pb-3">
          <h2 className="text-lg font-semibold text-white">{categoryName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close device panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {devices.length === 0 && (
          <p className="text-gray-400 text-center py-4">No devices found in this category.</p>
        )}

        {devices.length > 0 && (
          <ul className="space-y-2 h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-primary-900/20">
            {devices.map((device) => (
              <li
                key={device.id}
                className="px-4 py-3 bg-primary-700/40 hover:bg-primary-600/40 rounded-lg cursor-pointer text-gray-200 hover:text-white transition-all flex items-center"                onClick={() => {
                  openModal(device.name, device.id, categoryType, String(externalCode));
                  handleDeviceClick(device);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                {device.name}
              </li>
            ))}
          </ul>        )}
      </div>
    </>
  );
};

export default DevicePanel;
