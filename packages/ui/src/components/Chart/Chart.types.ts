import { ChartData, ChartOptions } from 'chart.js';

export type ChartUpdateMode = 'default' | 'reset' | 'resize' | 'none';

export interface ChartProps extends React.ComponentProps<'canvas'> {
  type: 'bar' | 'line' | 'pie' | 'radar' | 'doughnut' | 'polarArea' | 'scatter'; 
  data: ChartData;
  options?: ChartOptions;
  updateMode?: ChartUpdateMode;
} 