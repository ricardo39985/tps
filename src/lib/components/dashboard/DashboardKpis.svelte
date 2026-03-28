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
  <article class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Revenue</p>
    <p class="mt-2 text-3xl font-black text-white">{formatCurrency(metrics.revenue)}</p>
    <p class="mt-1 text-sm text-slate-300">Filtered sales value</p>
  </article>

  <article class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Transactions</p>
    <p class="mt-2 text-3xl font-black text-white">{metrics.transactions}</p>
    <p class="mt-1 text-sm text-slate-300">Orders in the selected scope</p>
  </article>

  <article class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Units Sold</p>
    <p class="mt-2 text-3xl font-black text-white">{metrics.unitsSold}</p>
    <p class="mt-1 text-sm text-slate-300">Total quantity across transactions</p>
  </article>

  <article class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Average Order</p>
    <p class="mt-2 text-3xl font-black text-white">{formatCurrency(metrics.averageOrderValue)}</p>
    <p class="mt-1 text-sm text-slate-300">Revenue divided by transactions</p>
  </article>

  <article class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Active Products</p>
    <p class="mt-2 text-3xl font-black text-white">{metrics.activeProducts}</p>
    <p class="mt-1 text-sm text-slate-300">Products with matching sales</p>
  </article>

  <article class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Active Staff</p>
    <p class="mt-2 text-3xl font-black text-white">{metrics.activeStaff}</p>
    <p class="mt-1 text-sm text-slate-300">Staff members with matching sales</p>
  </article>
</section>
