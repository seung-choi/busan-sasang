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
        <Card onClick={handleClick}>
            <Card.Content className="p-2">
                <div 
                    key={asset.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                    {asset.thumbnailFile ? (
                        <div className="thumbnail-container h-48 overflow-hidden bg-gray-100">
                            <img 
                                src={asset.thumbnailFile.url} 
                                alt={asset.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error('Error loading image:', e);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="py-4 text-center bg-gray-100">
                            <span className="text-gray-500">썸네일 없음</span>
                        </div>
                    )}
                </div>
            </Card.Content>
            <Card.Footer className="justify-center p-2 pt-0">
                {/* <p className="text-sm text-gray-500 mt-1 truncate">{asset.categoryName || 'No Category'}</p> */}
                <h3 className="font-medium text-gray-800 truncate text-center">{asset.name}</h3>
            </Card.Footer>
        </Card>
    );
} 

export default AssetCard;