import {provideEchartsCore} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {BarChart, LineChart} from 'echarts/charts';
import {GridComponent, LegendComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

// Register all modules you need
echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer, LegendComponent]);

export const provideEChartsConfig = () =>
  provideEchartsCore({echarts})
