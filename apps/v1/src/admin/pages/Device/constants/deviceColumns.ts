import { Device } from '../types/device.types';
import type { Column } from '@plug/ui';

export const columns: Column<Device>[] = [
    { key: 'id', label: '장비 ID'},
    { key: 'name' , label: '장비 이름'},
    { key: 'categoryName', label: '분류 이름'},
    { key: 'creator', label: '등록자'},
    { key: 'update', label: '등록일'},
    { key: 'management', label: '관리'},
]