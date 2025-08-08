import React from 'react';
import { Dialog } from '../Dialog';
import { Button } from '../Button';
import { cn } from '../../utils/classname';
import CloseIcon from '../../assets/icons/close.svg';
import { ModalProps } from './Modal.types';

const Modal = React.memo(({
                              children,
                              title,
                              footer,
                              width = '500px',
                              height = 'auto',
                              closable = true,
                              contentClassName,
                              headerClassName,
  titleClassName, showCloseButton,
bodyClassName,
                              footerClassName,
                              ref,
                              ...props
                          }: ModalProps) => {
    return (
        <Dialog
            {...props}
            ref={ref}
            closeOnOverlayClick={false}
            contentClassName={cn(
                'max-h-[90vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden',
                contentClassName
            )}
        >
            <div
                className="flex-1 flex flex-col w-full overflow-auto"
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height,
                }}
            >
                {(title || closable) && (
                    <div
                        className={cn(
                            'relative px-5 py-4 md:px-6 md:py-5 border-b border-slate-200',
                            headerClassName
                        )}
                    >
                        {title && (
                            <h2 className={cn("text-base md:text-lg font-semibold text-slate-800 leading-tight", titleClassName)}>
                                {title}
                            </h2>
                        )}
                        {closable && showCloseButton && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 h-6 w-6 p-0 text-slate-500 hover:text-slate-700 transition-colors"
                                onClick={props.onClose}
                                aria-label="닫기"
                            >
                                <CloseIcon />
                            </Button>
                        )}
                    </div>
                )}

                <div
                    className={cn(
                        'flex-1 overflow-auto px-5 py-4 md:px-6 md:py-5 text-slate-700 text-sm leading-relaxed',
                        bodyClassName
                    )}
                >
                    {children}
                </div>

                {footer && (
                    <div
                        className={cn(
                            'px-5 py-4 md:px-6 md:py-5 border-t border-slate-200 flex justify-end items-center gap-2',
                            footerClassName
                        )}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </Dialog>
    );
});

Modal.displayName = 'Modal';

export { Modal };
