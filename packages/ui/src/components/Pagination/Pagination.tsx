import { PaginationProps } from './Pagination.types';
import { cn } from '../../utils/classname'
import { Button } from '../Button'
import { PrevIcon, NextIcon } from '../../index.icons'

const Pagination = ({
  currentPage = 1,
  pageBlock = 10,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {

    const selectedPageClassName = 'bg-primary-600 text-white font-semibold'
    const unSelectedPageClassName = 'text-black bg-white hover:bg-blue-200 hover:text-white'

    const handlePageChange = (page: number) => {
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.floor((currentPage - 1) / pageBlock) * pageBlock + 1;
        const endPage = Math.min(totalPages, startPage + pageBlock - 1);

        if (startPage > 1) {
            pages.push(
                <Button
                    key="start-ellipsis"
                    className={cn(
                        'px-3 py-1 rounded-md',
                        unSelectedPageClassName,
                    )}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <PrevIcon />
                </Button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    color="primary"
                    className={
                        cn(
                            'px-3 py-1 rounded-md',
                            i === currentPage ? selectedPageClassName : unSelectedPageClassName,
                        )
                    }
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <Button
                    key="end-ellipsis"
                    className={cn(
                        'px-3 py-1 rounded-md',
                        unSelectedPageClassName,
                    )}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <NextIcon />
                </Button>
            );
        }

        return pages;
    }

    return (
        <div className={
            cn(  
                "flex justify-center space-x-2",
                className  
            )}
            role="navigation" 
            aria-label="Pagination">  

            <Button
                color="primary"  
                className={  
                    cn(  
                        "px-4 py-2 rounded-l-md",  
                        unSelectedPageClassName  
                    )  
                }  
                onClick={() => handlePageChange(Math.max(1, currentPage - pageBlock))}  
                disabled={currentPage === 1 || !totalPages}
                aria-label="Previous Page"  
            >  
                Prev  
            </Button>  
            {renderPageNumbers()}  
            <Button  
                color="primary"  
                className={  
                    cn(  
                        "px-4 py-2 rounded-l-md",  
                        unSelectedPageClassName  
                    )  
                }  
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + pageBlock))}
                disabled={currentPage === totalPages || !totalPages}
                aria-label="Next Page"  
            >  
                Next  
            </Button>  
        </div>  
    )
};

Pagination.displayName = 'Pagination';

export { Pagination }