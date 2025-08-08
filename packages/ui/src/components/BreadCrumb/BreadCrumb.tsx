import { createContext, useContext } from 'react';
import React from 'react';
import { cn } from '../../utils/classname';
import type{
    BreadCrumbProps,
    BreadCrumbItemProps,
} from './BreadCrumb.types';

interface BreadCrumbContextProps {
    color: 'primary' | 'secondary';
    size: 'small' | 'medium' | 'large';
    separator: 'line' | 'arrow';
}

const BreadCrumbContext = createContext<BreadCrumbContextProps | undefined>(undefined);

const BreadCrumb = ({
    color = 'primary',
    size = 'small',
    separator = 'line',
    className,
    children,
    ref,
    ...props
}: BreadCrumbProps) => {
    
    const BreadCrumbListStyle = 'flex flex-wrap items-center break-words';
    const BreadCrumbListSize = {
        small: 'text-sm gap-1.5',
        medium: 'text-base gap-2',
        large: 'text-lg gap-2.5',
    }[size];


    const BreadCrumbElement = React.Children.map(children,(child, index) => {
        if(React.isValidElement(child) && child.type === BreadCrumbItem){
            return React.cloneElement(child, {
                isLastItem: index === React.Children.count(children) - 1
            } as BreadCrumbItemProps)
        }
    })
    
    return (
        <BreadCrumbContext.Provider value={{color, size, separator}}>
            <nav
                ref={ref}
                aria-label='breadcrumb'
                {...props}
            >
                <ol 
                    className={cn(
                        BreadCrumbListStyle,
                        BreadCrumbListSize,
                        className,
                    )}
                >
                    {BreadCrumbElement}
                </ol>
            </nav>
        </BreadCrumbContext.Provider>
    )};

BreadCrumb.displayName = 'BreadCrumb';

const BreadCrumbItem = React.memo(({
    className,
    children,
    isLastItem,
    ...props
}: BreadCrumbItemProps) => {
    const context = useContext(BreadCrumbContext);

    if (!context) {
        throw new Error("BreadCrumbItem는 BreadCrumb 구성 요소 내에서 사용해야 합니다. <BreadCrumb.Item>이 <BreadCrumb> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    const { color, separator } = context;

    const BreadCrumbItemStyle = 'inline-flex items-center font-medium text-gray-500 hover:text-gray-700 transition-colors';

    const BreadcrumbListColor = {
        primary: 'text-primary-500',
        secondary: 'text-secondary-500',
    }[color];
        
    return (
        <>
            <li 
                className={cn(
                    BreadCrumbItemStyle,
                    BreadcrumbListColor,
                    className
                )}
                {...props}
            >
                {children}

            </li>
            {!isLastItem && separator === 'arrow' && (
                <li
                    role="presentation"
                    aria-hidden="true"
                    className="mx-1 text-gray-400 font-semibold select-none"
                >
                    &rsaquo;
                </li>
            )}

            {!isLastItem && separator === 'line' && (
                <li
                    role="presentation"
                    aria-hidden="true"
                    className="mx-2 w-px h-4 bg-gray-300"
                />
            )}
        </>
    )
});

BreadCrumbItem.displayName = 'BreadCrumbItem';

const BreadCrumbLink = ({
    href,
    className,
    children,
    ref,
    ...props
}: React.ComponentProps<'a'>) => {
    const context = useContext(BreadCrumbContext);

    if (!context) {
        throw new Error("BreadCrumbLink는 BreadCrumb 구성 요소 내에서 사용해야 합니다. <BreadCrumb.Link>가 <BreadCrumb> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
      }

    const { size, color } = context;

    const BreadCrumbLinkStyle = 'inline-flex items-center gap-1 text-sm font-normal text-gray-500 hover:text-gray-700 transition-colors overflow-hidden text-ellipsis whitespace-nowrap';
    const BreadcrumbLinkColor = {
        primary: 'hover:text-primary-500',
        secondary: 'hover:text-secondary-500',
    }[color];
    const BreadcrumbLinkSize = {
        small: 'max-w-40',
        medium: 'max-w-50',
        large: 'max-w-60',
    }[size];

    return (
        <a
            ref={ref}
            href={href}
            className={cn(
                BreadCrumbLinkStyle,
                BreadcrumbLinkColor,
                BreadcrumbLinkSize,
                className
            )}
            {...props}
        >
            {children}
        </a>
    )
};

BreadCrumbLink.displayName = 'BreadCrumbLink';
    
export { BreadCrumb, BreadCrumbItem, BreadCrumbLink };
