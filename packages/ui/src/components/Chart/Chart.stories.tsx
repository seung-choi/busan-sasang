import { Meta, StoryObj } from '@storybook/react';
import { ChartComponent } from './Chart';
import type { ChartProps } from '@plug/ui';

const meta: Meta<ChartProps> = {
  title: 'Components/Chart',
  component: ChartComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<ChartProps>;

// 막대 차트 예제
export const BarChart: Story = {
  args: {
    type: 'bar',
    width: '500px',
    height: '300px',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      datasets: [
        {
          label: '월간 판매량',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  },
};

// 선 차트 예제
export const LineChart: Story = {
  args: {
    type: 'line',
    width: '500px',
    height: '300px',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      datasets: [
        {
          label: '월간 성장률',
          data: [12, 19, 3, 5, 2, 3],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
  },
};

// 파이 차트 예제
export const PieChart: Story = {
  args: {
    type: 'pie',
    width: '300px',
    height: '300px',
    data: {
      labels: ['빨강', '파랑', '노랑', '초록', '보라'],
      datasets: [
        {
          label: '선호 색상',
          data: [12, 19, 3, 5, 2],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  },
};

// 도넛 차트 예제
export const DoughnutChart: Story = {
  args: {
    type: 'doughnut',
    width: '300px',
    height: '300px',
    data: {
      labels: ['일', '이', '삼', '사', '오'],
      datasets: [
        {
          label: '투표 수',
          data: [15, 25, 20, 30, 10],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  },
}; 