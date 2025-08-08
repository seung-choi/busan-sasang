import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CarouselProps } from './Carousel.types';
import { Button } from '@plug/ui';
import { cn } from '../../utils/classname';
import Prev from '../../assets/icons/previous.svg';
import Next from '../../assets/icons/next.svg';

export const Carousel = ({
  items,
  initialIndex = 0,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
  showNavigation = true,
  infinite = true,
  className,
}: CarouselProps) => {
  const transitionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(infinite ? initialIndex + 1 : initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayTimerRef = useRef<number | null>(null);

  const extendedItems = infinite && items.length > 1
    ? [items[items.length - 1], ...items, items[0]]
    : items;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(infinite ? index + 1 : index);
  }, [isTransitioning, infinite]);

  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = window.setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, nextSlide]);

  useEffect(() => {
    if (!infinite || !transitionRef.current) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      if (currentIndex === extendedItems.length - 1) {
        transitionRef.current!.style.transition = 'none';
        setCurrentIndex(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            transitionRef.current!.style.transition = '';
          });
        });
      } else if (currentIndex === 0) {
        transitionRef.current!.style.transition = 'none';
        setCurrentIndex(extendedItems.length - 2);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            transitionRef.current!.style.transition = '';
          });
        });
      }
    };

    const element = transitionRef.current;
    element.addEventListener('transitionend', handleTransitionEnd);

    return () => element.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, extendedItems.length, infinite]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  }, [prevSlide, nextSlide]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="캐러셀"
    >
      <div
        ref={transitionRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        aria-live="polite"
      >
        {extendedItems.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`슬라이드 ${((index - 1 + items.length) % items.length) + 1} / ${items.length}`}
            aria-hidden={index !== currentIndex}
          >
            {item}
          </div>
        ))}
      </div>

      {showNavigation && items.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            className="absolute opacity-50 top-1/2 left-4 -translate-y-1/2 text-gray-800"
            aria-label="이전 슬라이드"
            variant="ghost"
            color="default"
            size="icon"
          >
            <Prev />
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute opacity-50 top-1/2 right-4 -translate-y-1/2 text-gray-800"
            aria-label="다음 슬라이드"
            variant="ghost"
            color="default"
            size="icon"
          >
            <Next />
          </Button>
        </>
      )}

      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2" role="tablist">
          {items.map((_, index) => (
            <Button
              key={index}
              onClick={() => goToSlide(index)}
              className={`size-2.5 rounded-full transition-colors p-0 min-w-0 min-h-0 ${
                (currentIndex - 1 + items.length) % items.length === index ? 'bg-primary-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${index + 1}번 슬라이드로 이동`}
              aria-selected={(currentIndex - 1 + items.length) % items.length === index}
              role="tab"
              variant="ghost"
              size="icon"
            />
          ))}
        </div>
      )}
    </div>
  );
};
