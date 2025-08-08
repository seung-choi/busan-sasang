import { useState, useMemo } from 'react';
import { DataTableProps } from './DataTable.types';
import { Pagination } from '../Pagination';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import SearchFilter from './SearchFilter';

const DataTable = <T extends { id: string | number },>({
    data,
    columns,
    pageSize = 5,
    pageBlock = 10,
    onPageChange,
    filterFunction,
    showSearch = false,
    showPagination = true,
    selectable = false,
    onSelectChange,
    selectedRows = new Set<T>(),
  }: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [isSelectedRows, setIsSelectedRows] = useState<Set<T>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    if (search && filterFunction) {
      filtered = filtered.filter((item) => filterFunction(item, search));
    }
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, sortKey, sortOrder, search, filterFunction]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredAndSortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize, showPagination]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page, pageSize);
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const isControlled = selectedRows !== undefined;
  const currentSelected = isControlled ? selectedRows : isSelectedRows;
  
  const selectedChange = (newSelected: Set<T>) => {
    if (!isControlled) {
      setIsSelectedRows(newSelected);
    }
    onSelectChange?.(newSelected);
  }

  const isRowSelected = (row: T) => {
    for (const selectedRow of currentSelected) {
      if (selectedRow.id === row.id) {
        return true;
      }
    }
    return false;
  };

  const selectedAll = paginatedData.length > 0 && paginatedData.every(row => isRowSelected(row));

  const handleSelectAll = () => {
    const newSelected = new Set(currentSelected);
    
    if (selectedAll) {
      paginatedData.forEach(row => {
        for (const selectedRow of newSelected) {
          if (selectedRow.id === row.id) {
            newSelected.delete(selectedRow);
          }
        }
      });
    } else {
      paginatedData.forEach(row => {
        newSelected.add(row);
      });
    }
    selectedChange(newSelected);
  }

  const handleSelectRow = (row: T) => {
    const newSelected = new Set(currentSelected);
    if (isRowSelected(row)) {
      for (const selectedRow of newSelected) {
        if (selectedRow.id === row.id) {
          newSelected.delete(selectedRow);
        }
      }
    } else {
      newSelected.add(row);
    }
    selectedChange(newSelected);
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setCurrentPage(1);
  };


  return (
      <div className="w-full h-full overflow-x-auto flex flex-col justify-between">
        <div>
          {showSearch && (
              <SearchFilter search={search} onSearchChange={handleSearch} />
          )}
          <table className="min-w-full text-sm text-left text-slate-700 border-separate border-spacing-0">
            <TableHeader columns={columns} sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} selectable={selectable} selectedAll={selectedAll} onSelectChange={handleSelectAll}/>
            <TableBody data={showPagination ? paginatedData : filteredAndSortedData} columns={columns} search={search} selectable={selectable} onSelectChange={handleSelectRow} selectedRows={isRowSelected}/>
          </table>
        </div>

        {showPagination && (
            <div className="mt-4 flex justify-center">
              <Pagination
                  currentPage={currentPage}
                  pageBlock={pageBlock}
                  totalPages={Math.ceil(filteredAndSortedData.length / pageSize)}
                  onPageChange={handlePageChange}
              />
            </div>
        )}
      </div>
  );
};

DataTable.displayName = 'DataTable';

export { DataTable };
