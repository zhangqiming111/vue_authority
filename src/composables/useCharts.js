import * as echarts from 'echarts';
import { BASIC_CHARTS } from './charts';

const chartInstances = new Map();

function renderChart(id, option) {
  const el = document.getElementById(id);
  if (!el) return;

  echarts.dispose(el);
  const instance = echarts.init(el);
  instance.setOption(option);
  chartInstances.set(id, instance);
}

/** 初始化 ECharts 基础示例图表 */
export function initBasicCharts() {
  BASIC_CHARTS.forEach(({ id, option, getOption }) => {
    renderChart(id, getOption ? getOption() : option);
  });
}

/** 销毁已创建的图表实例，避免内存泄漏 */
export function disposeBasicCharts() {
  chartInstances.forEach((instance) => instance.dispose());
  chartInstances.clear();
}
