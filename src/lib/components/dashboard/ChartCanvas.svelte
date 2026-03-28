<script>
  import { onDestroy } from 'svelte';
  import { registerChartJs } from '../../charts/chartjs.js';

  export let type = 'bar';
  export let data = { labels: [], datasets: [] };
  export let options = {};
  export let ariaLabel = 'Dashboard chart';
  export let height = 300;

  let canvas;
  let chart;
  let lastType = type;

  function syncChart() {
    if (!canvas) {
      return;
    }

    const Chart = registerChartJs();

    if (!chart || lastType !== type) {
      chart?.destroy();
      chart = new Chart(canvas, {
        type,
        data,
        options
      });
      lastType = type;
      return;
    }

    chart.data = data;
    chart.options = options;
    chart.update('none');
  }

  $: if (canvas && type && data && options) {
    syncChart();
  }

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div class="chart-wrapper rounded-[22px] border border-white/10 bg-slate-950/25 p-4 shadow-lg">
  <div class="relative w-full" style={`height:${height}px;`}>
    <canvas bind:this={canvas} aria-label={ariaLabel}></canvas>
  </div>
</div>

<style>
  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
</style>
