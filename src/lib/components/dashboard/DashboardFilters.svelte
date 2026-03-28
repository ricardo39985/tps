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

<section class="surface-soft rounded-[26px] p-4">
  <div class="flex flex-col gap-3 border-b border-[var(--border-soft)] pb-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Dashboard Filters</p>
      <h3 class="mt-1 text-2xl font-black text-[var(--text)]">Refine the analytics view</h3>
      <p class="mt-1 text-sm text-[var(--muted)]">Filter by product type and staff member. Every chart and KPI updates together.</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span class="candy-pill px-3 py-1 text-xs font-semibold text-[var(--text)]">
        {filteredTransactionsCount} transaction{filteredTransactionsCount === 1 ? '' : 's'}
      </span>

      {#if hasActiveFilters}
        <button
          type="button"
          class="candy-button-secondary px-3 py-1 text-xs"
          on:click={onClearFilters}
        >
          Clear filters
        </button>
      {/if}
    </div>
  </div>

  <div class="mt-4 grid gap-4 lg:grid-cols-2">
    <label class="space-y-2">
      <span class="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Product type</span>
      <select
        class="candy-select appearance-none text-sm"
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
      <span class="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Staff member</span>
      <select
        class="candy-select appearance-none text-sm"
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

  <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
    <span class="candy-pill px-3 py-1">{filterSummary}</span>
    <span class="candy-pill px-3 py-1">Filters apply to the entire dashboard</span>
  </div>
</section>
