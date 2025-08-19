import { cn } from '../../utils/classname';
import type { SkeletonProps } from './Skeleton.types';

const Skeleton = ({
    variant = "rectangle",
    className,
    ...props
}: SkeletonProps ) => {
    return(
        <div 
            aria-busy="true"
            className={cn(
                "animate-pulse rounded-md bg-muted bg-gray-200",
                variant === "circle" && "rounded-full",
                variant === "rectangle" && "rounded-md",
                variant === "text" && "h-4 w-full rounded",
                className
            )}
            {...props}
        >
        </div>
    )
};

Skeleton.displayName = "Skeleton";

export { Skeleton };
