export interface CarouselProps {
    items: React.ReactNode[];
    initialIndex?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showIndicators?: boolean;
    showNavigation?: boolean;
    infinite?: boolean;
    className?: string;
  }