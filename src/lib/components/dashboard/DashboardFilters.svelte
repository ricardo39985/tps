<script>
  export let productOptions = [];
  export let staffOptions = [];
  export let selectedProduct = 'all';
  export let selectedStaff = 'all';
  export let onProductChange = () => {};
  export let onStaffChange = () => {};
  export let onClearFilters = () => {};
  export let hasActiveFilters = false;
  export let filterSummary = '';
  export let filteredTransactionsCount = 0;

  function handleProductChange(event) {
    onProductChange(event.currentTarget.value);
  }

  function handleStaffChange(event) {
    onStaffChange(event.currentTarget.value);
  }
</script>

<section class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
  <div class="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-cyan-200">Dashboard Filters</p>
      <h3 class="mt-1 text-2xl font-black text-white">Refine the analytics view</h3>
      <p class="mt-1 text-sm text-slate-300">Filter by product type and staff member. Every chart and KPI updates together.</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
        {filteredTransactionsCount} transaction{filteredTransactionsCount === 1 ? '' : 's'}
      </span>

      {#if hasActiveFilters}
        <button
          type="button"
          class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
          on:click={onClearFilters}
        >
          Clear filters
        </button>
      {/if}
    </div>
  </div>

  <div class="mt-4 grid gap-4 lg:grid-cols-2">
    <label class="space-y-2">
      <span class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Product type</span>
      <select
        class="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        value={selectedProduct}
        on:change={handleProductChange}
      >
        <option value="all">All products</option>
        {#each productOptions as option}
          <option value={option.value}>
            {option.label}{option.count ? ` (${option.count})` : ''}
          </option>
        {/each}
      </select>
    </label>

    <label class="space-y-2">
      <span class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Staff member</span>
      <select
        class="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        value={selectedStaff}
        on:change={handleStaffChange}
      >
        <option value="all">All staff</option>
        {#each staffOptions as option}
          <option value={option.value}>
            {option.label}{option.count ? ` (${option.count})` : ''}
          </option>
        {/each}
      </select>
    </label>
  </div>

  <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
    <span class="rounded-full bg-white/5 px-3 py-1">{filterSummary}</span>
    <span class="rounded-full bg-white/5 px-3 py-1">Filters apply to the entire dashboard</span>
  </div>
</section>
