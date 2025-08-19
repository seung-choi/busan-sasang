import { CategoryResponse } from "@plug/common-services";
import { Category } from '../../Device/types/category.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useCategory = (
    data: CategoryResponse[],
    onDelete: (categoryId: number) => void,
    onEdit: (categoryId: number) => void,
): Category[] => {
    return data.map(category => ({  
        id: category.id,
        name: category.name,
        iconFile: category.iconFile?.url ? (
          <img src={category.iconFile.url} alt="icon" width={30} height={30} className="rounded-md object-cover m-auto" />
        ) : '',
        creator: category.createdBy,
        update: DateFormatter(category.createdAt),
        management: (
            <div className="flex flex-wrap gap-1">
            <Button color="primary"
                    className="w-15 bg-secondary-100 text-secondary-700 font-semibold hover:bg-secondary-200"
                    onClick={() => onEdit(category.id)}>수정</Button>
            <Button 
                color="destructive" 
                className="w-15 bg-destructive-100 text-destructive-700 font-semibold hover:bg-destructive-200"
                onClick={() => onDelete(category.id)}
              >삭제</Button>
          </div>
        )

    }));
}