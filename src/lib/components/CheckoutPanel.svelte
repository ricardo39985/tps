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

<section class="checkout-panel rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
  <div class="mb-5 flex items-center justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.22em] text-cyan-200">Checkout</p>
      <h2 class="mt-1 text-2xl font-black text-white">Current Sale</h2>
    </div>
    <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
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
      <label for="staff_name" class="mb-2 block text-sm font-medium text-slate-200">Staff</label>
      <select
        id="staff_name"
        name="staff_name"
        required
        value={selectedStaff}
        on:change={(event) => onStaffChange(event.currentTarget.value)}
        class="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      >
        <option value="" class="bg-slate-950 text-white">Select staff</option>
        {#each staffList as member}
          <option value={member.name} class="bg-slate-950 text-white">{member.name}</option>
        {/each}
      </select>
    </div>

    <div class="rounded-[26px] border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-cyan-500/20 p-5 shadow-lg">
      <p class="text-xs uppercase tracking-[0.22em] text-fuchsia-200">Total Price</p>
      <div class="mt-2 flex items-end justify-between gap-4">
        <p class="text-4xl font-black leading-none text-white">{formatCurrency(total)}</p>
        <p class="text-sm font-semibold text-slate-200">{totalQuantity} unit{totalQuantity === 1 ? '' : 's'}</p>
      </div>
    </div>

    <button
      type="submit"
      class="group relative w-full overflow-hidden rounded-[24px] bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-5 py-4 text-base font-black text-slate-950 shadow-[0_20px_50px_rgba(14,165,233,0.22)] transition hover:scale-[1.01] active:scale-[0.99]"
    >
      <span class="relative z-10">Submit Transaction</span>
      <span class="absolute inset-0 translate-x-[-110%] bg-white/30 transition duration-700 group-hover:translate-x-[110%]"></span>
    </button>
  </form>

  <p class={`mt-4 text-sm ${statusTone === 'success' ? 'text-emerald-300' : statusTone === 'error' ? 'text-rose-300' : 'text-slate-300'}`}>
    {statusMessage}
  </p>
</section>
