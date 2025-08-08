import React from 'react';
import { useCallback, useId, useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/classname';
import type {
    SliderProps,
    SliderTrackProps,
    SliderThumbProps,
    SliderRangeProps,
    SliderContextProps
} from "./Slider.types";

const SliderContext = React.createContext<SliderContextProps | undefined>(undefined);

const Slider = ({
    size = 'small',
    color = 'primary',
    defaultValue = 0,
    value,
    onValueChange,
    disabled,
    min = 0,
    max = 100,
    step = 1,
    className,
    children,
    ...props
}: SliderProps) => {
    const [internalValue, setInternalValue] = useState<number>(
        defaultValue < min ? min : defaultValue > max ? max : defaultValue
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const sliderId = useId();
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isControlled && value !== undefined) {
            const clampedValue = Math.min(Math.max(value, min), max);
            if (clampedValue !== value) {
                onValueChange?.(clampedValue);
            }
        }
    }, [value, min, max, isControlled, onValueChange]);

    const setCurrentValue = useCallback((newValue: number) => {
        const clampedValue = Math.min(Math.max(newValue, min), max);
        
        if (!isControlled) {
            setInternalValue(clampedValue);
        }
        
        if (clampedValue !== currentValue) {
            onValueChange?.(clampedValue);
        }
    }, [isControlled, onValueChange, min, max, currentValue]);

    const sliderSize = {
        small: 'h-2',
        medium: 'h-3',
        large: 'h-4'
    }[size];

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        
        const slider = sliderRef.current;
        if (!slider) return;
        
        const rect = slider.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const newValue = min + position * (max - min);
        
        const steppedValue = Math.round(newValue / step) * step;
        setCurrentValue(steppedValue);
    };

    const hasCustomChildren = React.Children.count(children) > 0;

    return (
        <SliderContext.Provider value={{ 
            disabled, 
            currentValue, 
            setCurrentValue, 
            min, 
            max,
            step,
            size,
            color,
            sliderId,
            sliderRef: { current: sliderRef.current }
        }}>
            <div 
                ref={sliderRef}
                role="group"
                aria-labelledby={`${sliderId}-label`}
                aria-disabled={disabled}
                className={cn(
                    "relative rounded-full bg-gray-200",
                    sliderSize,
                    disabled ? "opacity-50" : "opacity-100",
                    className
                )}
                onClick={handleClick}
                {...props}
            >
                {hasCustomChildren ? (
                    children
                ) : (
                    <>
                        <SliderTrack>
                            <SliderThumb />
                        </SliderTrack>
                        <SliderRange />
                    </>
                )}
            </div>
        </SliderContext.Provider>
    );
};

Slider.displayName = "Slider";

const SliderTrack = React.memo(
    ({
        className,
        children,
        ...props
    }: SliderTrackProps) => {
        const context = React.useContext(SliderContext);
        if (!context) {
            throw new Error('SliderTrack은 Slider 구성 요소 내에서 사용해야 합니다. <Slider.Track>가 <Slider> 구성 요소 내부에 중첩되어 있는지 확인하세요.');
        }

        const { currentValue, min, max, color, disabled } = context;
        const sliderTrackWidth = ((currentValue - min) / (max - min)) * 100;

        return (
            <div 
                role="presentation"
                className={cn(
                    "absolute h-full rounded-full",
                    disabled ? 'bg-gray-300' : {
                        primary: 'bg-primary-500',
                        secondary: 'bg-secondary-500',
                    }[color],
                    className
                )}
                style={{ width: `${sliderTrackWidth}%` }}
                {...props}
            >
                {children}
            </div>
        );
    }
);

SliderTrack.displayName = "SliderTrack";

const SliderThumb = React.memo(({
    className,
    size: propSize,
    ...props
}: SliderThumbProps) => {
    const context = React.useContext(SliderContext);
    const thumbRef = useRef<HTMLSpanElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!context) {
        throw new Error('SliderThumb은 Slider 구성 요소 내에서 사용해야 합니다. <Slider.Thumb>이 <Slider> 구성 요소 내부에 중첩되어 있는지 확인하세요.');
    }

    const { 
        size: contextSize, 
        disabled, 
        currentValue, 
        setCurrentValue, 
        min, 
        max, 
        step,
        sliderId,
        sliderRef
    } = context;
    
    const size = propSize || contextSize;

    const sliderThumbSize = {
        small: 'w-3 h-3',
        medium: 'w-4 h-4',
        large: 'w-5 h-5'
    }[size];
    
    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return;
        
        e.preventDefault();
        setIsDragging(true);
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!sliderRef.current) return;
            
            const rect = sliderRef.current.getBoundingClientRect();
            const position = (moveEvent.clientX - rect.left) / rect.width;
            const newValue = min + position * (max - min);
            
            const steppedValue = Math.round(newValue / step) * step;
            const clampedValue = Math.min(Math.max(steppedValue, min), max);
            
            setCurrentValue(clampedValue);
        };
        
        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        
        const step = context.step || 1;
        let newValue = currentValue;
        
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = Math.min(currentValue + step, max);
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = Math.max(currentValue - step, min);
                break;
            case 'ViewerPage':
                newValue = min;
                break;
            case 'End':
                newValue = max;
                break;
            default:
                return;
        }
        
        e.preventDefault();
        setCurrentValue(newValue);
    };
    
    return (
        <span 
            ref={thumbRef}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            aria-disabled={disabled}
            id={`${sliderId}-thumb`}
            className={cn(
                sliderThumbSize,
                "absolute bg-white rounded-full -translate-y-1/2 -translate-x-1/2 top-1/2 left-full",
                "shadow-[0_2px_3px_rgba(0,0,0,0.2)]",
                isDragging && "ring-2 ring-offset-2 ring-primary-500",
                disabled ? "cursor-not-allowed" : "cursor-grab",
                isDragging && !disabled && "cursor-grabbing",
                className
            )}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
});

SliderThumb.displayName = "SliderThumb";

const SliderRange = React.memo(
    ({
        className,
        ...props
    }: SliderRangeProps) => {
        const context = React.useContext(SliderContext);

        if (!context) {
            throw new Error('SliderRange는 Slider 구성 요소 내에서 사용해야 합니다. <Slider.Range>가 <Slider> 구성 요소 내부에 중첩되어 있는지 확인하세요.');
        }

        const { disabled, currentValue, setCurrentValue, min, max, step, sliderId } = context; 

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentValue(Number(e.target.value));
        };

        return (
          <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                disabled={disabled}
                aria-label="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={currentValue}
                aria-disabled={disabled}
                id={`${sliderId}-input`}
                onChange={handleChange}
                className={cn(
                    "absolute w-full h-full opacity-0",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                    className
                )}
                {...props}
            />
        );
    }
);

SliderRange.displayName = "SliderRange";

export { Slider, SliderTrack, SliderThumb, SliderRange };