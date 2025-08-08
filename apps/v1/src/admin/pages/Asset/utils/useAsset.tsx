import { AssetResponse } from '@plug/common-services';
import { Asset } from '../../Asset/types/asset.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useAsset = (
  data: AssetResponse[],
  onDelete: (assetId: number) => void,
  onEdit: (assetId: number) => void
): Asset[] => {
  return data.map(asset => ({
    id: String(asset.id),
    name: asset.name,
    code: asset.code,
    thumbnailFile: asset.thumbnailFile?.originalFileName,
    creator: asset.createdBy,
    update: DateFormatter(asset.createdAt),
    management: (
      <div className="flex flex-wrap gap-1">
        <Button color="primary"
                className="w-15 bg-secondary-100 text-secondary-700 font-semibold hover:bg-secondary-200"
                onClick={() => onEdit(asset.id)}>수정</Button>
        <Button 
            color="destructive" 
            className="w-15 bg-destructive-100 text-destructive-700 font-semibold hover:bg-destructive-200"
            onClick={() => onDelete(asset.id)}
          >삭제</Button>
      </div>
    ),
  }));
}