<script>
  import BasketPanel from './BasketPanel.svelte';
  import { formatCurrency } from '../utils/format.js';

  export let basket = [];
  export let staffList = [];
  export let selectedStaff = '';
  export let total = 0;
  export let totalQuantity = 0;
  export let onStaffChange = () => {};
  export let onSubmit = () => {};
  export let onIncrease = () => {};
  export let onDecrease = () => {};
  export let onRemove = () => {};
  export let statusMessage = '';
  export let statusTone = 'neutral';
</script>

<section class="checkout-panel surface-strong rounded-[30px] p-5">
  <div class="mb-5 flex items-center justify-between gap-4">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Checkout</p>
      <h2 class="mt-1 text-2xl font-black text-[var(--text)]">Current Sale</h2>
    </div>
    <div class="candy-pill px-3 py-2 text-xs font-semibold text-emerald-600">
      Transaction Ready
    </div>
  </div>

  <form class="space-y-5" on:submit|preventDefault={onSubmit}>
    <BasketPanel
      basket={basket}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onRemove={onRemove}
    />

    <div>
      <label for="staff_name" class="mb-2 block text-sm font-medium text-[var(--muted)]">Staff</label>
      <select
        id="staff_name"
        name="staff_name"
        required
        value={selectedStaff}
        on:change={(event) => onStaffChange(event.currentTarget.value)}
        class="candy-select appearance-none"
      >
        <option value="">Select staff</option>
        {#each staffList as member}
          <option value={member.name}>{member.name}</option>
        {/each}
      </select>
    </div>

    <div class="surface rounded-[26px] p-5">
      <p class="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Total Price</p>
      <div class="mt-2 flex items-end justify-between gap-4">
        <p class="text-4xl font-black leading-none text-[var(--text)]">{formatCurrency(total)}</p>
        <p class="text-sm font-semibold text-[var(--muted)]">{totalQuantity} unit{totalQuantity === 1 ? '' : 's'}</p>
      </div>
    </div>

    <button
      type="submit"
      class="group candy-button-primary relative w-full overflow-hidden px-5 py-4 text-base"
    >
      <span class="relative z-10">Submit Transaction</span>
      <span class="absolute inset-0 translate-x-[-110%] bg-white/30 transition duration-700 group-hover:translate-x-[110%]"></span>
    </button>
  </form>

  <p class={`mt-4 text-sm ${statusTone === 'success' ? 'text-emerald-600' : statusTone === 'error' ? 'text-rose-500' : 'text-[var(--muted)]'}`}>
    {statusMessage}
  </p>
</section>
