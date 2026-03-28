import { Chart, registerables } from 'chart.js';

let chartRegistered = false;

export function registerChartJs() {
  if (!chartRegistered) {
    Chart.register(...registerables);
    chartRegistered = true;
  }

  return Chart;
}
