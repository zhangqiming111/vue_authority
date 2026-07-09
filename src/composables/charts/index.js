import { createGraphOption } from './graphOption';
import { SUNBURST_DATA } from './sunburstData';
import { lineOption } from './options/line';
import { barOption } from './options/bar';
import { pieOption } from './options/pie';
import { scatterOption } from './options/scatter';
import { areaOption } from './options/area';
import { candlestickOption } from './options/candlestick';
import { radarOption } from './options/radar';
import { treemapOption } from './options/treemap';
import { gaugeOption } from './options/gauge';
import { funnelOption } from './options/funnel';

/** @type {{ id: string, option?: object, getOption?: () => object }[]} */
export const BASIC_CHARTS = [
  { id: 'line', option: lineOption },
  { id: 'bar', option: barOption },
  { id: 'pie', option: pieOption },
  { id: 'scatter', option: scatterOption },
  { id: 'area', option: areaOption },
  { id: 'candlestick', option: candlestickOption },
  { id: 'radar', option: radarOption },
  { id: 'treemap', option: treemapOption },
  { id: 'gauge', option: gaugeOption },
  { id: 'funnel', option: funnelOption },
  { id: 'graph', getOption: createGraphOption },
  {
    id: 'sunburst',
    option: {
      series: {
        type: 'sunburst',
        data: SUNBURST_DATA,
        radius: [60, '90%'],
        itemStyle: { borderRadius: 7, borderWidth: 2 },
        label: { show: false },
      },
    },
  },
];
