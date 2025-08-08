import { cn } from '../../utils/classname';
import * as React from 'react';
import { Button } from '@plug/ui';
import CloseIcon from '../../assets/icons/close.svg';
import ErrorIcon from '../../assets/icons/alert_error.svg';
import SuccessIcon from '../../assets/icons/alert_success.svg';
import InfoIcon from '../../assets/icons/alert_info.svg';
import NoticeIcon from '../../assets/icons/alert_notice.svg';
import { Dialog } from '@plug/ui';
import type { AlertProps } from './Alert.types';

const Alert = ({
                   variant = 'default',
                   onClose,
                   ref,
                   className,
                   children,
                   isOpen,
                   ...props
               }: AlertProps) => {
    const alertBaseStyle =
        'relative max-w-md w-full flex items-start gap-3 rounded-lg border px-5 py-5 shadow-md bg-white';

    const alertVariantStyle = {
        default: 'border-slate-200 text-slate-800 bg-white',
        success: 'border-green-200 bg-green-50 text-green-900',
        error: 'border-red-200 bg-red-50 text-red-900',
        notice: 'border-yellow-200 bg-yellow-50 text-yellow-900',
        info: 'border-blue-200 bg-blue-50 text-blue-900',
    }[variant];

    const alertIcon = {
        default: null,
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        notice: <NoticeIcon />,
        info: <InfoIcon />,
    }[variant];

    return (
        <Dialog
            ref={ref}
            closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            contentClassName={cn(alertBaseStyle, alertVariantStyle, className)}
            {...props}
        >
            {variant !== 'default' && (
                <div className="shrink-0 mt-0.5">{alertIcon}</div>
            )}

            <div className="flex-1 min-w-0">
                {children}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-6 w-6 p-0 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="닫기"
            >
                <CloseIcon />
            </Button>
        </Dialog>
    );
};

Alert.displayName = 'Alert';

const AlertTitle = ({
                        ref,
                        className,
                        children,
                        ...props
                    }: React.ComponentProps<'h2'>) => {
    return (
        <h2
            ref={ref}
            className={cn('text-sm font-semibold leading-snug mb-1', className)}
            {...props}
        >
            {children}
        </h2>
    );
};

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = ({
                              ref,
                              className,
                              children,
                              ...props
                          }: React.ComponentProps<'p'>) => {
    return (
        <p
            ref={ref}
            className={cn('text-sm text-slate-700 leading-snug', className)}
            {...props}
        >
            {children}
        </p>
    );
};

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
