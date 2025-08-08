import * as React from 'react';
import { useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'chart.js/auto';
import type { ChartProps } from './Chart.types';

ChartJS.register(...registerables);

const emptyChartData = {
  labels: [],
  datasets: []
};

const ChartComponent = React.memo(({ 
  type, 
  data, 
  options = {}, 
  width = '100%', 
  height = '300px',
  updateMode = 'default'
}: ChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // 메모이제이션: data가 변경될 때만 새로운 객체 생성
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    const ctx = chartRef.current;

    if (ctx) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: type,
        data: emptyChartData,
        options: options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, options]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data = memoizedData;
      
      switch (updateMode) {
        case 'reset':
        case 'resize':
        case 'none':
          chartInstance.current.update(updateMode);
          break;
        default:
          chartInstance.current.update();
          break;
      }
    }
  }, [memoizedData, updateMode]);

  return (
    <canvas ref={chartRef} width={width} height={height} />
  );
});

export { ChartComponent };