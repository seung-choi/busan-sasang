import { LineResponse } from '@plug/common-services';
import { Line } from '../types/line.types'
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useLine = (
  data: LineResponse[],
  onDelete: (lineId: number) => void,
  onEdit: (lineId: number) => void
): Line[] => {
  return data.map(line => ({
    id: line.id,
    name: line.name,
    color:(
      <span 
        className="inline-block w-8 h-8 rounded-full border border-gray-300 shadow-md"
        style={{ backgroundColor:line.color }}
      />
    ),
    creator: line.createdBy,
    update: DateFormatter(line.createdAt),
    management: (
      <div className="flex flex-wrap gap-1">
        <Button color="primary"
                className='w-15 bg-secondary-100 text-secondary-700 font-semibold hover:bg-secondary-200'
                onClick={() => onEdit(line.id)}>수정</Button>
        <Button 
            color="destructive" 
            className="w-15 bg-destructive-100 text-destructive-700 font-semibold hover:bg-destructive-200"
            onClick={() => onDelete(line.id)}
          >삭제</Button>
      </div>
    ),
  }));
}