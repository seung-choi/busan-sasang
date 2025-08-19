import { api } from '@plug/api-hooks';
import { Card } from '@plug/ui';
import type { Asset } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { useStationStore } from '../store/stationStore';

import * as Px from '@plug/engine/src';

interface PoiCreateOption {
    id: string;
    iconUrl: string;
    modelUrl?: string;
    displayText: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property: { [key: string]: any; };
}

const AssetCard = ({asset}: {asset: Asset;}) => {

    const { currentStationId } = useStationStore();

    const handleClick = () => {
        console.log('Asset clicked:', asset);
        const poiCreateOption: PoiCreateOption = {
            id: uuidv4(),
            iconUrl: '',
            modelUrl: asset.file.url,
            displayText: 'Device 할당 필요',
            property: {}
        };

        Px.Poi.Create(poiCreateOption, createPoiComplete);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createPoiComplete = (poi: any) => {
        console.log('POI created:', poi);
        api.post('features', {
            facilityId: currentStationId,
            floorId: poi.floorId,
            id: poi.id,
            assetId: asset.id,
            position: {
                x: poi.position.x,
                y: poi.position.y,
                z: poi.position.z
            },
            rotation: {
                x: poi.rotation.x,
                y: poi.rotation.y,
                z: poi.rotation.z
            },
            scale: {
                x: poi.scale.x,
                y: poi.scale.y,
                z: poi.scale.z
            }
        }).then(response => {
            console.log('Feature created successfully:', response);
        }).catch(error => {
            console.error('Error creating feature:', error);
        });
    }

    return (
      <Card onClick={handleClick} className="border-none hover:translate-y-[-5px] transition-all duration-300">
        <Card.Content className="p-0">
          <div
            key={asset.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
          >
            {asset.thumbnailFile ? (
              <div className="thumbnail-container h-48 overflow-hidden bg-gray-100 relative">
                <img
                  src={asset.thumbnailFile.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
            썸네일 없음
          </span>
              </div>
            )}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-medium rounded-full shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
              {asset.name}
            </div>

          </div>
        </Card.Content>
      </Card>
    );
}

export default AssetCard;