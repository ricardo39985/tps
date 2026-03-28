<script>
  import ChartCanvas from './ChartCanvas.svelte';

  export let chart = { data: { labels: [], datasets: [] }, options: {} };
</script>

<section class="surface-strong rounded-[24px] p-4">
  <div class="mb-4">
    <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent-4)]">Staff</p>
    <h3 class="mt-1 text-xl font-black text-[var(--text)]">Top staff</h3>
    <p class="mt-1 text-sm text-[var(--muted)]">Highest-revenue staff members in the current scope.</p>
  </div>

  <ChartCanvas type="bar" data={chart.data} options={chart.options} ariaLabel="Staff performance chart" height={320} />
</section>
