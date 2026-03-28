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

<section class="rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
  <div class="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-cyan-200">Analytics</p>
      <h2 class="mt-1 text-3xl font-black text-white">Sales Insights Dashboard</h2>
      <p class="mt-2 max-w-3xl text-sm text-slate-300">
        Review revenue, transaction volume, product performance, and staff performance. Refine the view by product type or staff member to inspect any slice of the data.
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Current scope</p>
      <p class="mt-1 font-semibold text-white">{dashboard?.filterSummary || 'All products • All staff'}</p>
    </div>
  </div>

  {#if dashboard?.loading}
    <div class="grid gap-4 py-6">
      <div class="h-24 animate-pulse rounded-[24px] bg-white/5"></div>
      <div class="h-72 animate-pulse rounded-[24px] bg-white/5"></div>
    </div>
  {:else if !hasDashboard}
    <div class="py-8 text-center">
      <h3 class="text-xl font-black text-white">Loading dashboard data</h3>
      <p class="mt-2 text-sm text-slate-300">The sheet data is still being fetched. The charts will appear as soon as the data is ready.</p>
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
        <div class="rounded-[24px] border border-dashed border-cyan-300/30 bg-slate-950/30 p-8 text-center">
          <h3 class="text-xl font-black text-white">No matching records</h3>
          <p class="mt-2 text-sm text-slate-300">{dashboard.noResultsMessage}</p>
          {#if dashboard.hasFilters}
            <button
              type="button"
              class="mt-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
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
          <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
            <p class="text-xs uppercase tracking-[0.22em] text-fuchsia-200">Top products</p>
            {#if dashboard.topProducts.length}
              <div class="mt-3 space-y-3">
                {#each dashboard.topProducts as product}
                  <div class="rounded-2xl border border-white/10 bg-slate-950/25 p-3">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold text-white">{product.label}</p>
                        <p class="text-xs text-slate-400">{product.transactions} transaction{product.transactions === 1 ? '' : 's'} · {product.units} unit{product.units === 1 ? '' : 's'}</p>
                      </div>
                      <p class="text-sm font-bold text-cyan-200">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="mt-3 text-sm text-slate-300">No product insights for the current filter scope.</p>
            {/if}
          </div>

          <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
            <p class="text-xs uppercase tracking-[0.22em] text-emerald-200">Top staff</p>
            {#if dashboard.topStaff.length}
              <div class="mt-3 space-y-3">
                {#each dashboard.topStaff as member}
                  <div class="rounded-2xl border border-white/10 bg-slate-950/25 p-3">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold text-white">{member.label}</p>
                        <p class="text-xs text-slate-400">{member.transactions} transaction{member.transactions === 1 ? '' : 's'} · {member.units} unit{member.units === 1 ? '' : 's'}</p>
                      </div>
                      <p class="text-sm font-bold text-emerald-200">{formatCurrency(member.revenue)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="mt-3 text-sm text-slate-300">No staff insights for the current filter scope.</p>
            {/if}
          </div>
        </aside>
      </div>
    </div>
  {/if}
</section>
