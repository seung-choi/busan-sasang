import { User } from '../types/user.types';
import type { Column } from '@plug/ui';

export const columns: Column<User>[] = [
    { key: 'id', label: '아이디' },
    { key: 'username', label: '이름' },
    { key: 'phoneNumber', label: '연락처'},
    { key: 'department', label: '부서'},
    { key: 'status', label: '접속 여부' },
    { key: 'role', label: '권한' },
    { key: 'management', label: '관리' },
];