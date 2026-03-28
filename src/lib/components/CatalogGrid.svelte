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

<section class="rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
  <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-xl font-bold text-white sm:text-2xl">Available Items</h2>
      <p class="text-sm text-slate-300">Tap a product card to load it into the checkout panel.</p>
    </div>

    <div class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
      </svg>
      <input
        type="text"
        value={query}
        on:input={(event) => onSearch(event.currentTarget.value)}
        placeholder="Search items..."
        class="w-40 bg-transparent text-sm text-white placeholder:text-slate-400 outline-none sm:w-56"
      />
    </div>
  </div>

  {#if !items.length}
    <div class="rounded-[22px] border border-white/10 bg-white/5 p-8 text-center">
      <p class="text-lg font-bold text-white">No items found</p>
      <p class="mt-2 text-sm text-slate-300">Try a different search term.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {#each items as item (item._rowNumber ?? `${item.item_code}-${item.item_name}`)}
        {@const inCart = quantityInBasket(item.item_code) > 0}
        <button
          type="button"
          class={`item-card relative overflow-hidden rounded-[20px] border p-4 text-left transition duration-200 ${inCart ? 'border-cyan-300/60 bg-slate-800/90 shadow-[0_12px_30px_rgba(34,211,238,0.14)]' : 'border-white/10 bg-slate-800/70 hover:border-cyan-300/35 hover:bg-slate-800'}`}
          data-code={item.item_code}
          on:click={() => onAdd(item.item_code)}
        >
          <div class={`absolute inset-0 bg-gradient-to-br ${item.accent || 'from-cyan-500/20 to-sky-500/10'} opacity-40`}></div>
          <div class="relative flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.item_code}</p>
              <h3 class="mt-1 text-lg font-bold text-white">{item.item_name}</h3>
              <p class="mt-1 line-clamp-2 text-sm text-slate-300">{item.description}</p>
            </div>

            <div class="shrink-0 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-bold text-cyan-200">
              {formatCurrency(item.unit_price)}
            </div>
          </div>

          <div class="relative mt-4 flex items-center justify-between">
            <span class={`text-xs font-semibold uppercase tracking-[0.16em] ${inCart ? 'text-emerald-300' : 'text-slate-400'}`}>
              {inCart ? `${quantityInBasket(item.item_code)} in cart` : 'Tap to add'}
            </span>

            <span class="rounded-lg bg-white/8 px-3 py-1.5 text-sm font-semibold text-white">+ Add</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</section>
