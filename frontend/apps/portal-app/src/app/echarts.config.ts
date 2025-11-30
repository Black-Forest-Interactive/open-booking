import {provideEchartsCore} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {BarChart, LineChart} from 'echarts/charts'; // ONLY import needed Chart Types
import {GridComponent, TooltipComponent} from 'echarts/components'; // ONLY import needed Components
import {CanvasRenderer} from 'echarts/renderers'; // Canvas is generally lighter/faster

// Register all modules you need
echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

export const provideEChartsConfig = () =>
  provideEchartsCore({echarts})
