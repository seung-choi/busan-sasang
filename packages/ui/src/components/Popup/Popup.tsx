import React from 'react';
import { Dialog } from '../Dialog';
import { Button } from '../Button';
import { cn } from '../../utils/classname';
import CloseIcon from '../../assets/icons/close.svg';
import { PopupProps, PopupPlacement } from './Popup.types';

const getPlacementClasses = (placement: PopupPlacement): string => {
    switch (placement) {
        case 'top':
            return 'items-start justify-center pt-4';
        case 'topLeft':
            return 'items-start justify-start p-4';
        case 'topRight':
            return 'items-start justify-end p-4';
        case 'bottom':
            return 'items-end justify-center pb-4';
        case 'bottomLeft':
            return 'items-end justify-start p-4';
        case 'bottomRight':
            return 'items-end justify-end p-4';
        case 'center':
        default:
            return 'items-center justify-center';
    }
};

const Popup = React.memo(({
                              children,
                              title,
                              placement = 'center',
                              width = '300px',
                              closable = true,
                              contentClassName,
                              headerClassName,
                              bodyClassName,
                              overlayClassName,
                              ref,
                              ...props
                          }: PopupProps) => {
    const widthClass = typeof width === 'number' ? `w-[${width}px]` : `w-[${width}]`;

    return (
        <Dialog
            {...props}
            ref={ref}
            closeOnOverlayClick={true}
            overlayClassName={cn(
                getPlacementClasses(placement),
                'z-[9999] bg-slate-900/20 backdrop-blur-xs',
                overlayClassName
            )}
            contentClassName={cn(
                'bg-white rounded-lg shadow-xl',
                'transition-all duration-300 animate-fade-in',
                contentClassName
            )}
        >
            <div className={cn('flex flex-col', widthClass)}>
                {(title || closable) && (
                    <div
                        className={cn(
                            'flex items-center justify-between px-4 py-3 border-b border-slate-200',
                            headerClassName
                        )}
                    >
                        {title && (
                            <h3 className="text-sm font-semibold text-slate-800">
                                {title}
                            </h3>
                        )}
                        {closable && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 p-0 text-slate-500 hover:text-slate-700 transition-colors"
                                onClick={props.onClose}
                                aria-label="닫기"
                            >
                                <CloseIcon />
                            </Button>
                        )}
                    </div>
                )}

                <div className={cn(
                    'p-4 text-sm text-slate-700',
                    bodyClassName
                )}>
                    {children}
                </div>
            </div>
        </Dialog>
    );
});

Popup.displayName = 'Popup';

export { Popup };
