import { UserResponse } from '@plug/common-services';
import { User } from '../types/user.types';
import { Button } from '@plug/ui';

export const useUser = (
    data: UserResponse[],
    statusData: Record<number,boolean>,
    onDelete: (userId: number) => void,
    onEdit: (assetId: number) => void,
    onPasswordEdit: (userId: number) => void,
    onRoleEdit: (userId: number) => void
  ): User[] => {
    return data.map(user => ({
      id: String(user.id),
      username: user.username,
      phoneNumber: user.phoneNumber,
      department: user.department,
      status: statusData[user.id] 
      ? <span className="inline-block rounded-full w-4 h-4 bg-green-500 border border-gray-200 shadow-md" /> 
      : <span className="inline-block rounded-full w-4 h-4 bg-red-500 border border-gray-200 shadow-md" />,
      role: user.roles.map(role => role.name).join(', '),
      management: (
          <div className="flex flex-wrap gap-1 justify-center">
              <Button color="primary"
                      className="w-15 bg-primary-100 text-primary-800 font-semibold hover:bg-primary-200"
                      onClick={() => onEdit(user.id)}>수정</Button>
              <Button color="primary"
                      className="w-15 bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300"
                      onClick={() => onRoleEdit(user.id)}>권한</Button>
              <Button color="secondary"
                      className="w-33 bg-secondary-200 text-secondary-900 font-semibold hover:bg-secondary-300"
                      onClick={() => onPasswordEdit(user.id)}>비밀번호 수정</Button>
              <Button
                  color="destructive"
                  className="w-15 bg-destructive-200 text-destructive-800 font-semibold hover:bg-destructive-300"
                  onClick={() => onDelete(user.id)}
              >삭제</Button>
          </div>
      ),
    }));
  } 