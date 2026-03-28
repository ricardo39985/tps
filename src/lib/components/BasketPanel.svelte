<script>
  import { formatCurrency } from '../utils/format.js';

  export let basket = [];
  export let onIncrease = () => {};
  export let onDecrease = () => {};
  export let onRemove = () => {};
</script>

<div class="surface-soft rounded-[28px] p-4">
  <div class="mb-3 flex items-center justify-between gap-3">
    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Cart</p>
      <h3 class="mt-1 text-xl font-black text-[var(--text)]">Current Basket</h3>
    </div>
    <div class="candy-pill px-3 py-2 text-sm font-black text-[var(--accent)]">
      {basket.length} item{basket.length === 1 ? '' : 's'}
    </div>
  </div>

  <div class="divide-y divide-[rgba(255,255,255,0.12)] overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.28)]">
    {#if basket.length === 0}
      <div class="p-5 text-center">
        <p class="text-base font-black text-[var(--text)]">Your cart is empty</p>
        <p class="mt-1 text-sm text-[var(--muted)]">Tap product cards to add items here.</p>
      </div>
    {:else}
      {#each basket as item (item.item_code)}
        <div class="cart-row flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-base font-black leading-tight text-[var(--text)]">{item.item_name}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{item.item_code}</p>
              </div>

              <div class="shrink-0 text-right">
                <p class="text-lg font-black leading-none text-[var(--accent)]">{formatCurrency(item.quantity * item.unit_price)}</p>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <div class="surface-inner flex items-center rounded-2xl">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-[var(--text)] transition hover:bg-white/40"
                aria-label="Decrease quantity"
                on:click={() => onDecrease(item.item_code)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
              </button>

              <div class="min-w-[28px] px-1 text-center text-sm font-black text-[var(--text)]">
                {item.quantity}
              </div>

              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-[var(--text)] transition hover:bg-white/40"
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
              class="flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-300/30 bg-rose-100/70 text-rose-500 transition hover:bg-rose-200/70"
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
