import { cn } from '../../utils/classname';
import { useEffect, useState } from 'react';
import { Button } from '@plug/ui';
import CloseIcon from '../../assets/icons/close.svg';
import { createPortal } from 'react-dom';
import type {
    ToastPortalProps,
    ToastProps,
    ToastTitleProps,
    ToastDescriptionProps,
} from './Toast.types';

const ToastPortal = ({ children }: ToastPortalProps) => {
    return createPortal(<>{children}</>, document.body);
};

const Toast = ({
                   variant = 'default',
                   placement = 'bottomRight',
                   duration = 300,
                   autoClose = true,
                   autoCloseDuration = 3000,
                   closable = false,
                   onClose,
                   isOpen,
                   ref,
                   className,
                   children,
                   ...props
               }: ToastProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

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
                if (onClose) {
                    onClose();
                }
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration]);

    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseDuration, autoClose]);

    if (!isMounted) return null;

    const getPlacementClasses = (placement: string): string => {
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

    const toastBase = 'relative flex gap-3 px-5 py-4 w-full max-w-sm rounded-lg shadow-md transition-all duration-300 border text-sm';
    const toastVariant = {
        default: 'bg-white border-gray-200 text-slate-800',
        normal: 'bg-green-50 border-green-200 text-green-900',
        caution: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        warning: 'bg-orange-50 border-orange-200 text-orange-900',
        critical: 'bg-rose-50 border-rose-200 text-rose-900',
    }[variant];

    const toastAnimation = cn(
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        'transform transition-all duration-300 ease-in-out'
    );

    return (
        <ToastPortal>
            {isVisible && (
                <div
                className={cn(
                    'fixed inset-0 z-[9999] flex pointer-events-none',
                    getPlacementClasses(placement)
                )}
            >
                <div
                    className={cn(
                        toastBase,
                        toastVariant,
                        toastAnimation,
                        'pointer-events-auto relative',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    <div className="flex-1">{children}</div>

                    {(closable || !autoClose) && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2.5 right-2.5 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            onClick={onClose}
                            aria-label="닫기"
                        >
                            <CloseIcon />
                        </Button>
                    )}
                </div>
            </div>
            )}
        </ToastPortal>
    );
};

Toast.displayName = 'Toast';

const ToastTitle = ({
                        ref,
                        className,
                        children,
                        ...props
                    }: ToastTitleProps) => {
    return (
        <h2
            ref={ref}
            className={cn('text-sm font-semibold mb-1 leading-tight', className)}
            {...props}
        >
            {children}
        </h2>
    );
};

ToastTitle.displayName = 'ToastTitle';

const ToastDescription = ({
                              ref,
                              className,
                              children,
                              ...props
                          }: ToastDescriptionProps) => {
    return (
        <p
            ref={ref}
            className={cn('text-sm text-slate-600', className)}
            {...props}
        >
            {children}
        </p>
    );
};

ToastDescription.displayName = 'ToastDescription';

export { Toast, ToastTitle, ToastDescription };
