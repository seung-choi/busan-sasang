import { Button, cn } from '@plug/ui';

interface StateInfoProps {
    type?: 'error' | 'empty';
    title: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}

export const StateInfo = ({
                              type = 'error',
                              title,
                              description,
                              onRetry,
                              className,
                          }: StateInfoProps) => {
    const isError = type === 'error';

    return (
        <div
            className={cn(
                'flex flex-col h-80 items-center justify-center text-center p-8 rounded-lg',
                isError ? 'bg-red-50' : ' bg-muted',
                className
            )}
        >
            <div
                className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mb-4',
                    isError ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                )}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                    />
                </svg>
            </div>
            <h2 className={cn('text-xl font-bold mb-2', isError ? 'text-red-600' : 'text-foreground')}>
                {title}
            </h2>
            {description && (
                <p className={cn('text-sm mb-6', isError ? 'text-red-500' : 'text-muted-foreground')}>
                    {description}
                </p>
            )}
            {isError && onRetry && (
                <Button
                    onClick={onRetry}
                    color="destructive"
                    className="shadow-lg hover:shadow-md transition-shadow"
                >
                    다시 시도하기
                </Button>
            )}
        </div>
    );
};
