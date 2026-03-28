<script>
  import { formatCurrency } from '../utils/format.js';

  export let dashboard = null;
  export let liveDate = '--';
  export let liveTime = '--';
  export let itemsCount = 0;
  export let firstItem = null;
  export let cartItemCount = 0;
  export let cartTotal = 0;
</script>

<section class="mb-6">
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Revenue</p>
      <p class="mt-2 text-2xl font-black text-white">{formatCurrency(dashboard?.total_revenue || 0)}</p>
    </div>

    <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Transactions</p>
      <p class="mt-2 text-2xl font-black text-white">{dashboard?.total_transactions || 0}</p>
    </div>

    <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Staff</p>
      <p class="mt-2 text-2xl font-black text-white">{dashboard?.total_staff || 0}</p>
    </div>

    <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Units Sold</p>
      <p class="mt-2 text-2xl font-black text-white">{dashboard?.total_units_sold || 0}</p>
    </div>
  </div>

  <div class="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
    <div class="summary-panel rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-emerald-200">Live Summary</p>
          <h3 class="mt-1 text-xl font-black text-white">Sale Snapshot</h3>
        </div>
        <div class="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
          Frontend Preview
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Selected Item</p>
          <p class="mt-2 text-lg font-bold text-white">{firstItem ? firstItem.item_name : 'None'}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Current Quantity</p>
          <p class="mt-2 text-lg font-bold text-white">{cartItemCount}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Current Total</p>
          <p class="mt-2 text-lg font-bold text-white">{formatCurrency(cartTotal)}</p>
        </div>
      </div>
    </div>

    <div class="rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-xl backdrop-blur-xl">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-300">Date</p>
      <p class="mt-2 text-base font-semibold text-white">{liveDate}</p>
      <p class="mt-4 text-[11px] uppercase tracking-[0.18em] text-slate-300">Time</p>
      <p class="mt-2 text-base font-semibold text-white">{liveTime}</p>
      <p class="mt-4 text-[11px] uppercase tracking-[0.18em] text-slate-300">Items</p>
      <p class="mt-2 text-base font-semibold text-white">{itemsCount}</p>
    </div>
  </div>
</section>
