<script>
  import ChartCanvas from './ChartCanvas.svelte';

  export let chart = { data: { labels: [], datasets: [] }, options: {} };
</script>

<section class="surface-strong rounded-[24px] p-4">
  <div class="mb-4">
    <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent-3)]">Products</p>
    <h3 class="mt-1 text-xl font-black text-[var(--text)]">Top products</h3>
    <p class="mt-1 text-sm text-[var(--muted)]">Highest-revenue products in the current scope.</p>
  </div>

  <ChartCanvas type="bar" data={chart.data} options={chart.options} ariaLabel="Product performance chart" height={320} />
</section>
