import { cn } from '../../utils/classname';
import { createPortal } from 'react-dom';
import { Button } from '@plug/ui';
import CloseIcon from '../../assets/icons/close.svg';
import { useEffect, useState } from 'react';
import type {
    SheetPortalProps,
    SheetProps,
    SheetHeaderProps,
    SheetContentProps,
    SheetFooterProps
} from './Sheet.types';

const SheetPortal = ({ children }: SheetPortalProps) => {
    return createPortal(<>{children}</>, document.body);
};

SheetPortal.displayName = 'SheetPortal';

const Sheet = ({
                   isOpen,
                   closeOnOverlayClick = true,
                   closable = true,
                   overlay = true,
                   position = 'right',
                   onClose,
                   className,
                   children,
                   ref,
                   ...props
               }: SheetProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    closable = overlay && closeOnOverlayClick ? false : true;

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    if (!isMounted) return null;

    const basePositionStyle = {
        right: 'right-0 inset-y-0 max-w-sm',
        left: 'left-0 inset-y-0 max-w-sm',
        top: 'inset-x-0 top-0 max-h-[90vh]',
        bottom: 'inset-x-0 bottom-0 max-h-[90vh]',
    }[position];

    const animationStyle = {
        right: isVisible ? 'translate-x-0' : 'translate-x-full',
        left: isVisible ? 'translate-x-0' : '-translate-x-full',
        top: isVisible ? 'translate-y-0' : '-translate-y-full',
        bottom: isVisible ? 'translate-y-0' : 'translate-y-full',
    }[position];

    return (
        <SheetPortal>
            {overlay && (
                <div
                    className="fixed inset-0 z-[9998] bg-black/40 transition-opacity"
                    onClick={handleOverlayClick}
                />
            )}
            <div
                ref={ref}
                className={cn(
                    'fixed z-[9999] w-full bg-white shadow-xl transition-transform duration-300 ease-in-out',
                    basePositionStyle,
                    animationStyle,
                    className
                )}
                role="dialog"
                {...props}
            >
                {closable && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 h-6 w-6 p-0 text-slate-500 hover:text-slate-700"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        <CloseIcon />
                    </Button>
                )}
                <div className="flex h-full flex-col divide-y divide-slate-100">
                    {children}
                </div>
            </div>
        </SheetPortal>
    );
};

Sheet.displayName = 'Sheet';

const SheetHeader = ({ className, children, ref }: SheetHeaderProps) => (
    <div className={cn('px-5 py-4 flex items-center justify-between', className)} ref={ref}>
        {children}
    </div>
);

const SheetContent = ({ className, children, ref }: SheetContentProps) => (
    <div className={cn('flex-1 overflow-auto px-5 py-4 text-sm text-slate-700', className)} ref={ref}>
        {children}
    </div>
);

const SheetFooter = ({ className, children, ref }: SheetFooterProps) => (
    <div className={cn('px-5 py-4 flex justify-end gap-2', className)} ref={ref}>
        {children}
    </div>
);

SheetHeader.displayName = 'SheetHeader';
SheetContent.displayName = 'SheetContent';
SheetFooter.displayName = 'SheetFooter';

export { SheetPortal, Sheet, SheetHeader, SheetContent, SheetFooter };
