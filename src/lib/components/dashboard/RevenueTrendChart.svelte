<script>
  import ChartCanvas from './ChartCanvas.svelte';

  export let chart = { data: { labels: [], datasets: [] }, options: {} };
</script>

<section class="surface-strong rounded-[24px] p-4">
  <div class="mb-4">
    <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Trend</p>
    <h3 class="mt-1 text-xl font-black text-[var(--text)]">Revenue over time</h3>
    <p class="mt-1 text-sm text-[var(--muted)]">Daily revenue for the selected filter scope.</p>
  </div>

  <ChartCanvas type="line" data={chart.data} options={chart.options} ariaLabel="Revenue trend chart" height={320} />
</section>
