import * as React from "react";
import { useState } from 'react';
import { cn } from '../../utils/classname';
import { Button } from '@plug/ui';
import CloseIcon from '../../assets/icons/close.svg';
import type { CardProps } from '@plug/ui';

const Card = ({ 
  className, 
  closable = false, 
  onClose, 
  ref,
  ...props 
}: CardProps) => {    
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    };

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white shadow-sm relative",
          className
        )}
        {...props}
      >
        {closable && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={handleClose}
            aria-label="닫기"
          >
            <CloseIcon />
          </Button>
        )}
        {props.children}
      </div>
    );
  };
Card.displayName = "Card";

const CardHeader = React.memo(({ 
  className, 
  ref,
  ...props 
}: React.ComponentProps<'div'>) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-4", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.memo(({ 
  className, 
  ref,
  ...props 
}: React.ComponentProps<'h3'>) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-lg font-semibold leading-none tracking-tight text-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.memo(({ 
  className, 
  ref,
  ...props 
}: React.ComponentProps<'p'>) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-gray-500", className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.memo(({ 
  className,
  ref, 
  ...props 
}: React.ComponentProps<'div'>) => {
    return (
      <div
        ref={ref}
        className={cn("p-4 pt-0", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.memo(({ 
  className, 
  ref,
  ...props 
}: React.ComponentProps<'div'>) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-4 pt-0", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 