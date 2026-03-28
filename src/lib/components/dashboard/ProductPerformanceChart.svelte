<script>
  import ChartCanvas from './ChartCanvas.svelte';

  export let chart = { data: { labels: [], datasets: [] }, options: {} };
</script>

<section class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
  <div class="mb-4">
    <p class="text-xs uppercase tracking-[0.22em] text-fuchsia-200">Products</p>
    <h3 class="mt-1 text-xl font-black text-white">Top products</h3>
    <p class="mt-1 text-sm text-slate-300">Highest-revenue products in the current scope.</p>
  </div>

  <ChartCanvas type="bar" data={chart.data} options={chart.options} ariaLabel="Product performance chart" height={320} />
</section>
