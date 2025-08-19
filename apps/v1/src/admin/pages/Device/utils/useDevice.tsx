import { DeviceResponse } from "@plug/common-services";
import { Device } from '../../Device/types/device.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useDevice = (
    data: DeviceResponse[],
    onDelete: (deviceId: string) => void,
    onEdit: (deviceId: string) => void,
): Device[] => {
    return data.map(device => ({  
        id: device.id,
        name: device.name,
        categoryName: device.categoryName,
        creator: device.createdBy,
        update: DateFormatter(device.createdAt),
        management: (
            <div className="flex flex-wrap gap-1">
            <Button color="primary"
                    className="w-15 bg-secondary-100 text-secondary-700 font-semibold hover:bg-secondary-200"
                    onClick={() => onEdit(device.id)}>수정</Button>
            <Button 
                color="destructive" 
                className="w-15 bg-destructive-100 text-destructive-700 font-semibold hover:bg-destructive-200"
                onClick={() => onDelete(device.id)}
              >삭제</Button>
          </div>
        )

    }));
}