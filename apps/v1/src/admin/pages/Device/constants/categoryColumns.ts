import { Category } from '../types/category.types';
import type { Column } from '@plug/ui';

export const columns: Column<Category>[] = [
    { key: 'name' , label: '이름'},
    { key: 'iconFile', label: '파일'},
    { key: 'creator', label: '등록자'},
    { key: 'update', label: '등록일'},
    { key: 'management', label: '관리'},
]