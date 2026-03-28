<script>
  import { formatCurrency } from '../../utils/format.js';

  export let metrics = {
    revenue: 0,
    transactions: 0,
    unitsSold: 0,
    averageOrderValue: 0,
    activeProducts: 0,
    activeStaff: 0
  };
</script>

<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  <article class="surface-soft rounded-[24px] p-4">
    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Revenue</p>
    <p class="mt-2 text-3xl font-black text-[var(--text)]">{formatCurrency(metrics.revenue)}</p>
    <p class="mt-1 text-sm text-[var(--muted)]">Filtered sales value</p>
  </article>

  <article class="surface-soft rounded-[24px] p-4">
    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Transactions</p>
    <p class="mt-2 text-3xl font-black text-[var(--text)]">{metrics.transactions}</p>
    <p class="mt-1 text-sm text-[var(--muted)]">Orders in the selected scope</p>
  </article>

  <article class="surface-soft rounded-[24px] p-4">
    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Units Sold</p>
    <p class="mt-2 text-3xl font-black text-[var(--text)]">{metrics.unitsSold}</p>
    <p class="mt-1 text-sm text-[var(--muted)]">Total quantity across transactions</p>
  </article>

  <article class="surface-soft rounded-[24px] p-4">
    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Average Order</p>
    <p class="mt-2 text-3xl font-black text-[var(--text)]">{formatCurrency(metrics.averageOrderValue)}</p>
    <p class="mt-1 text-sm text-[var(--muted)]">Revenue divided by transactions</p>
  </article>

  <article class="surface-soft rounded-[24px] p-4">
    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Active Products</p>
    <p class="mt-2 text-3xl font-black text-[var(--text)]">{metrics.activeProducts}</p>
    <p class="mt-1 text-sm text-[var(--muted)]">Products with matching sales</p>
  </article>

  <article class="surface-soft rounded-[24px] p-4">
    <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Active Staff</p>
    <p class="mt-2 text-3xl font-black text-[var(--text)]">{metrics.activeStaff}</p>
    <p class="mt-1 text-sm text-[var(--muted)]">Staff members with matching sales</p>
  </article>
</section>
