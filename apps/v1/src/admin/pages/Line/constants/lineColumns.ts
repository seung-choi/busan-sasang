import { Line } from '../types/line.types'
import type { Column } from '@plug/ui';

export const columns: Column<Line>[] = [
    { key: 'name', label: '호선' },
    { key: 'color', label: '색상' },
    { key: 'creator', label: '등록자' },
    { key: 'update', label: '등록일' },
    { key: 'management', label: '관리' },
];