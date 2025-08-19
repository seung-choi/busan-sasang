import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '@plug/ui';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Carousel에 표시될 아이템 목록',
    },
    initialIndex: {
      control: { type: 'number', min: 0 },
      description: '초기 활성화 인덱스',
    },
    autoPlay: {
      control: 'boolean',
      description: '자동 재생 활성화',
    },
    autoPlayInterval: {
      control: { type: 'number', min: 1000 },
      description: '자동 재생 간격 (밀리초)',
    },
    showIndicators: {
      control: 'boolean',
      description: '인디케이터 표시 여부',
    },
    showNavigation: {
      control: 'boolean',
      description: '네비게이션 화살표 표시 여부',
    },
    infinite: {
      control: 'boolean',
      description: '무한 루프 활성화',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// 샘플 슬라이드 생성 함수
const createSlide = (index: number, color: string) => (
  <div
    className={`flex items-center justify-center h-64 ${color} text-white font-bold text-2xl`}
  >
    슬라이드 {index + 1}
  </div>
);

const sampleSlides = [
  createSlide(0, 'bg-orange-500'),
  createSlide(1, 'bg-green-500'),
  createSlide(2, 'bg-red-500'),
  createSlide(3, 'bg-purple-500'),
];

export const Default: Story = {
  args: {
    items: sampleSlides,
    initialIndex: 0,
    autoPlay: false,
    showIndicators: true,
    showNavigation: true,
    infinite: true,
  },
};

export const AutoPlay: Story = {
  args: {
    items: sampleSlides,
    initialIndex: 0,
    autoPlay: true,
    autoPlayInterval: 2000,
    showIndicators: true,
    showNavigation: true,
    infinite: true,
  },
};

export const StartWithThirdSlide: Story = {
  args: {
    items: sampleSlides,
    initialIndex: 2,
    autoPlay: false,
    showIndicators: true,
    showNavigation: true,
    infinite: true,
  },
};

export const HideIndicators: Story = {
  args: {
    items: sampleSlides,
    initialIndex: 0,
    autoPlay: false,
    showIndicators: false,
    showNavigation: true,
    infinite: true,
  },
};

export const HideNavigation: Story = {
  args: {
    items: sampleSlides,
    initialIndex: 0,
    autoPlay: false,
    showIndicators: true,
    showNavigation: false,
    infinite: true,
  },
};

export const NonInfinite: Story = {
  args: {
    items: sampleSlides,
    initialIndex: 0,
    autoPlay: false,
    showIndicators: true,
    showNavigation: true,
    infinite: false,
  },
};