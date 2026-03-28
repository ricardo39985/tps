<script>
  import { formatCurrency } from '../utils/format.js';

  export let items = [];
  export let basket = [];
  export let query = '';
  export let onSearch = () => {};
  export let onAdd = () => {};

  function quantityInBasket(itemCode) {
    const matched = basket.find((entry) => entry.item_code === itemCode);
    return matched ? matched.quantity : 0;
  }
</script>

<section class="surface rounded-[30px] p-4 sm:p-5">
  <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-xl font-black text-[var(--text)] sm:text-2xl">Available Items</h2>
      <p class="text-sm text-[var(--muted)]">Tap a product card to load it into the checkout panel.</p>
    </div>

    <div class="surface-inner flex items-center gap-2 rounded-[18px] px-3 py-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
      </svg>
      <input
        type="text"
        value={query}
        on:input={(event) => onSearch(event.currentTarget.value)}
        placeholder="Search items..."
        class="w-40 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none sm:w-56"
      />
    </div>
  </div>

  {#if !items.length}
    <div class="surface-soft rounded-[22px] p-8 text-center">
      <p class="text-lg font-black text-[var(--text)]">No items found</p>
      <p class="mt-2 text-sm text-[var(--muted)]">Try a different search term.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {#each items as item (item._rowNumber ?? `${item.item_code}-${item.item_name}`)}
        {@const inCart = quantityInBasket(item.item_code) > 0}
        <button
          type="button"
          class={`item-card relative overflow-hidden rounded-[22px] border p-4 text-left transition duration-200 ${inCart ? 'border-[color-mix(in_srgb,var(--accent)_45%,white)] bg-[var(--surface-strong)] shadow-[0_14px_34px_rgba(255,127,169,0.14)]' : 'border-[var(--border-soft)] bg-[var(--surface-soft)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_34%,var(--border-soft))]'}`}
          data-code={item.item_code}
          on:click={() => onAdd(item.item_code)}
        >
          <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,127,169,0.18),rgba(110,221,247,0.14),rgba(194,157,253,0.1))] opacity-70"></div>
          <div class="relative flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{item.item_code}</p>
              <h3 class="mt-1 text-lg font-black text-[var(--text)]">{item.item_name}</h3>
              <p class="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{item.description}</p>
            </div>

            <div class="shrink-0 rounded-xl bg-[rgba(255,255,255,0.32)] px-3 py-2 text-sm font-black text-[var(--text)]">
              {formatCurrency(item.unit_price)}
            </div>
          </div>

          <div class="relative mt-4 flex items-center justify-between">
            <span class={`text-xs font-semibold uppercase tracking-[0.16em] ${inCart ? 'text-emerald-500' : 'text-[var(--muted)]'}`}>
              {inCart ? `${quantityInBasket(item.item_code)} in cart` : 'Tap to add'}
            </span>

            <span class="candy-pill px-3 py-1.5 text-sm font-semibold">+ Add</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</section>
