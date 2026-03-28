<script>
  import { formatCurrency } from '../../utils/format.js';
  import DashboardFilters from './DashboardFilters.svelte';
  import DashboardKpis from './DashboardKpis.svelte';
  import ProductPerformanceChart from './ProductPerformanceChart.svelte';
  import RevenueTrendChart from './RevenueTrendChart.svelte';
  import StaffPerformanceChart from './StaffPerformanceChart.svelte';

  export let dashboard = null;
  export let onProductChange = () => {};
  export let onStaffChange = () => {};
  export let onClearFilters = () => {};

  $: hasDashboard = Boolean(dashboard && !dashboard.loading);
  $: hasResults = Boolean(dashboard && dashboard.filteredTransactions && dashboard.filteredTransactions.length);
</script>

<section class="surface rounded-[30px] p-4 sm:p-5">
  <div class="flex flex-col gap-4 border-b border-[var(--border-soft)] pb-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Analytics</p>
      <h2 class="mt-1 text-3xl font-black text-[var(--text)]">Sales Insights Dashboard</h2>
      <p class="mt-2 max-w-3xl text-sm text-[var(--muted)]">
        Review revenue, transaction volume, product performance, and staff performance. Refine the view by product type or staff member to inspect any slice of the data.
      </p>
    </div>

    <div class="surface-inner rounded-2xl px-4 py-3 text-sm text-[var(--text)]">
      <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Current scope</p>
      <p class="mt-1 font-semibold text-[var(--text)]">{dashboard?.filterSummary || 'All products • All staff'}</p>
    </div>
  </div>

  {#if dashboard?.loading}
    <div class="grid gap-4 py-6">
      <div class="surface-soft h-24 animate-pulse rounded-[24px]"></div>
      <div class="surface-soft h-72 animate-pulse rounded-[24px]"></div>
    </div>
  {:else if !hasDashboard}
    <div class="py-8 text-center">
      <h3 class="text-xl font-black text-[var(--text)]">Loading dashboard data</h3>
      <p class="mt-2 text-sm text-[var(--muted)]">The sheet data is still being fetched. The charts will appear as soon as the data is ready.</p>
    </div>
  {:else}
    <div class="mt-4 space-y-4">
      <DashboardFilters
        productOptions={dashboard.productOptions}
        staffOptions={dashboard.staffOptions}
        selectedProduct={dashboard.productFilter}
        selectedStaff={dashboard.staffFilter}
        hasActiveFilters={dashboard.hasFilters}
        filterSummary={dashboard.filterSummary}
        filteredTransactionsCount={dashboard.filteredTransactions.length}
        onProductChange={onProductChange}
        onStaffChange={onStaffChange}
        onClearFilters={onClearFilters}
      />

      {#if !hasResults}
        <div class="surface-soft rounded-[24px] border-dashed border-[var(--accent-2)] p-8 text-center">
          <h3 class="text-xl font-black text-[var(--text)]">No matching records</h3>
          <p class="mt-2 text-sm text-[var(--muted)]">{dashboard.noResultsMessage}</p>
          {#if dashboard.hasFilters}
            <button
              type="button"
              class="mt-4 candy-button-secondary px-4 py-2 text-sm"
              on:click={onClearFilters}
            >
              Clear filters
            </button>
          {/if}
        </div>
      {/if}

      <DashboardKpis metrics={dashboard.metrics} />

      <div class="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
        <div class="space-y-4">
          <RevenueTrendChart chart={dashboard.revenueTrendChart} />

          <div class="grid gap-4 lg:grid-cols-2">
            <ProductPerformanceChart chart={dashboard.productPerformanceChart} />
            <StaffPerformanceChart chart={dashboard.staffPerformanceChart} />
          </div>
        </div>

        <aside class="space-y-4">
          <div class="surface-strong rounded-[24px] p-4">
            <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent-3)]">Top products</p>
            {#if dashboard.topProducts.length}
              <div class="mt-3 space-y-3">
                {#each dashboard.topProducts as product}
                  <div class="surface-inner rounded-2xl p-3">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold text-[var(--text)]">{product.label}</p>
                        <p class="text-xs text-[var(--muted)]">{product.transactions} transaction{product.transactions === 1 ? '' : 's'} · {product.units} unit{product.units === 1 ? '' : 's'}</p>
                      </div>
                      <p class="text-sm font-bold text-[var(--accent)]">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="mt-3 text-sm text-[var(--muted)]">No product insights for the current filter scope.</p>
            {/if}
          </div>

          <div class="surface-strong rounded-[24px] p-4">
            <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent-4)]">Top staff</p>
            {#if dashboard.topStaff.length}
              <div class="mt-3 space-y-3">
                {#each dashboard.topStaff as member}
                  <div class="surface-inner rounded-2xl p-3">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold text-[var(--text)]">{member.label}</p>
                        <p class="text-xs text-[var(--muted)]">{member.transactions} transaction{member.transactions === 1 ? '' : 's'} · {member.units} unit{member.units === 1 ? '' : 's'}</p>
                      </div>
                      <p class="text-sm font-bold text-emerald-600">{formatCurrency(member.revenue)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="mt-3 text-sm text-[var(--muted)]">No staff insights for the current filter scope.</p>
            {/if}
          </div>
        </aside>
      </div>
    </div>
  {/if}
</section>
