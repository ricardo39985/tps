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
    <div class="surface-soft rounded-[24px] p-4">
      <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Revenue</p>
      <p class="mt-2 text-2xl font-black text-[var(--text)]">{formatCurrency(dashboard?.total_revenue || 0)}</p>
    </div>

    <div class="surface-soft rounded-[24px] p-4">
      <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Transactions</p>
      <p class="mt-2 text-2xl font-black text-[var(--text)]">{dashboard?.total_transactions || 0}</p>
    </div>

    <div class="surface-soft rounded-[24px] p-4">
      <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Staff</p>
      <p class="mt-2 text-2xl font-black text-[var(--text)]">{dashboard?.total_staff || 0}</p>
    </div>

    <div class="surface-soft rounded-[24px] p-4">
      <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Units Sold</p>
      <p class="mt-2 text-2xl font-black text-[var(--text)]">{dashboard?.total_units_sold || 0}</p>
    </div>
  </div>

  <div class="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
    <div class="summary-panel surface-strong rounded-[24px] p-4">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent-4)]">Live Summary</p>
          <h3 class="mt-1 text-xl font-black text-[var(--text)]">Sale Snapshot</h3>
        </div>
        <div class="candy-pill px-3 py-1 text-xs font-semibold text-emerald-600">
          Frontend Preview
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="surface-inner rounded-2xl p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Selected Item</p>
          <p class="mt-2 text-lg font-black text-[var(--text)]">{firstItem ? firstItem.item_name : 'None'}</p>
        </div>

        <div class="surface-inner rounded-2xl p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Current Quantity</p>
          <p class="mt-2 text-lg font-black text-[var(--text)]">{cartItemCount}</p>
        </div>

        <div class="surface-inner rounded-2xl p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Current Total</p>
          <p class="mt-2 text-lg font-black text-[var(--text)]">{formatCurrency(cartTotal)}</p>
        </div>
      </div>
    </div>

    <div class="surface-strong rounded-[24px] p-4">
      <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Date</p>
      <p class="mt-2 text-base font-semibold text-[var(--text)]">{liveDate}</p>
      <p class="mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Time</p>
      <p class="mt-2 text-base font-semibold text-[var(--text)]">{liveTime}</p>
      <p class="mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Items</p>
      <p class="mt-2 text-base font-semibold text-[var(--text)]">{itemsCount}</p>
    </div>
  </div>
</section>
