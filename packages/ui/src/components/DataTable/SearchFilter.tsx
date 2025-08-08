import { SearchFilterProps } from './DataTable.types';

const SearchFilter = ({ search, onSearchChange }: SearchFilterProps) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                className="py-2 px-3 border border-slate-300 rounded-md text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder="검색어를 입력하세요"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default SearchFilter;
