export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageBlock?: number;
  onPageChange: (page: number) => void;
  className?: string;
}