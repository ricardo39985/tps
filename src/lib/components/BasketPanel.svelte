<script>
  import { formatCurrency } from '../utils/format.js';

  export let basket = [];
  export let onIncrease = () => {};
  export let onDecrease = () => {};
  export let onRemove = () => {};
</script>

<div class="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
  <div class="mb-3 flex items-center justify-between gap-3">
    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Cart</p>
      <h3 class="mt-1 text-xl font-black text-white">Current Basket</h3>
    </div>
    <div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-200">
      {basket.length} item{basket.length === 1 ? '' : 's'}
    </div>
  </div>

  <div class="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
    {#if basket.length === 0}
      <div class="p-5 text-center">
        <p class="text-base font-bold text-white">Your cart is empty</p>
        <p class="mt-1 text-sm text-slate-300">Tap product cards to add items here.</p>
      </div>
    {:else}
      {#each basket as item (item.item_code)}
        <div class="cart-row flex items-center justify-between gap-3 px-4 py-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-base font-black leading-tight text-white">{item.item_name}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">{item.item_code}</p>
              </div>

              <div class="shrink-0 text-right">
                <p class="text-lg font-black leading-none text-cyan-200">{formatCurrency(item.quantity * item.unit_price)}</p>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <div class="flex items-center rounded-xl border border-white/10 bg-white/[0.04]">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-slate-200 transition hover:bg-white/10"
                aria-label="Decrease quantity"
                on:click={() => onDecrease(item.item_code)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
              </button>

              <div class="min-w-[28px] px-1 text-center text-sm font-black text-white">
                {item.quantity}
              </div>

              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-slate-200 transition hover:bg-white/10"
                aria-label="Increase quantity"
                on:click={() => onIncrease(item.item_code)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/8 text-rose-300 transition hover:bg-rose-400/15"
              aria-label="Remove item"
              on:click={() => onRemove(item.item_code)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6V4h8v2m-7 0 1 14h6l1-14M10 11v6m4-6v6" />
              </svg>
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
