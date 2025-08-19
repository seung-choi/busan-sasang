import React from 'react';
import { TableBodyProps } from './DataTable.types';
import { cn } from '../../utils/classname';
import { Checkbox } from '../Checkbox';

const TableBody = <T,>({ 
    data, 
    columns, 
    search, 
    selectable = false, 
    selectedRows,
    onSelectChange,
}: TableBodyProps<T> & { search?: string }) => {
  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
      <tbody>
      {data.length === 0 ? (
          <tr>
            <td colSpan={selectable ? columns.length + 1 : columns.length} className="p-4 text-center text-slate-400 text-sm">
              데이터가 없습니다.
            </td>
          </tr>
      ) : (
          data.map((row, i) => (
              <tr
                  key={i}
                  className={cn(
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                      'hover:bg-slate-100 transition-colors'
                  )}
              >
                {selectable && (
                  <td className="p-3 border-t border-slate-200">
                        <Checkbox 
                              checked={selectedRows?.(row)}
                              onChange={() => onSelectChange?.(row)}
                        />
                    </td>
                )}
                {columns.map((col) => (
                    <td
                        key={String(col.key)}
                        role="cell"
                        className="p-3 border-t border-slate-200 text-sm text-center"
                    >
                      {typeof row[col.key] === 'string' && search
                          ? highlightText(row[col.key] as string, search)
                          : (row[col.key] as React.ReactNode)}
                    </td>
                ))}
              </tr>
          ))
      )}
      </tbody>
  );
};

export default TableBody;