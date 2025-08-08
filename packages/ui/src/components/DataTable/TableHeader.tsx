import { TableHeaderProps } from './DataTable.types';
import { Checkbox } from '../Checkbox';

const TableHeader = <T,>({
                             columns,
                             sortKey,
                             sortOrder,
                             onSort,
                             selectable = false,
                             selectedAll = false,
                             onSelectChange,
                         }: TableHeaderProps<T>) => {
    return (
        <thead className="bg-slate-100 text-slate-700 text-xs font-semibold">
        <tr>
            {selectable && (
                <th
                    scope="col"
                    className="p-3 border-b border-slate-200"
                >
                    <Checkbox 
                        checked={selectedAll}
                        onChange={onSelectChange}
                    />
                </th>
            )}
            {columns.map((col) => (
                <th
                    key={String(col.key)}
                    scope="col"
                    className="p-3 border-b border-slate-200 cursor-pointer select-none hover:bg-slate-200 transition-colors"
                    onClick={() => onSort(col.key)}
                    aria-sort={sortKey === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                    <div className="flex items-center justify-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                            <span className="text-xs text-slate-400">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                    </div>
                </th>
            ))}
        </tr>
        </thead>
    );
};

export default TableHeader;
