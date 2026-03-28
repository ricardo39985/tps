<script>
  import { formatCurrency } from '../../utils/format.js';

  export let items = [];
  export let onAddItem = () => {};
  export let onDeleteItem = () => {};

  let itemName = '';
  let description = '';
  let itemPrice = '';

  $: nextItemCode = (() => {
    const highest = items.reduce((max, item) => {
      const match = String(item?.item_code || '').trim().match(/^C(\d+)$/i);
      return match ? Math.max(max, Number(match[1] || 0)) : max;
    }, 0);

    return `C${String(highest + 1).padStart(3, '0')}`;
  })();

  async function add() {
    const result = await onAddItem({
      item_name: itemName.trim(),
      description: description.trim(),
      unit_price: itemPrice
    });

    if (result?.ok) {
      itemName = '';
      description = '';
      itemPrice = '';
    }
  }
</script>

<section>
  <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 class="text-lg font-black">Add Item</h3>
      <div class="mt-4 space-y-3">
        <div class="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
          <p class="text-xs uppercase tracking-[0.18em] text-cyan-200">Item code</p>
          <p class="mt-1 text-sm font-semibold text-white">{nextItemCode}</p>
        </div>
        <input bind:value={itemName} type="text" placeholder="Item name" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
        <input bind:value={description} type="text" placeholder="Description" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
        <input bind:value={itemPrice} type="number" step="0.01" placeholder="Unit price" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
        <button type="button" class="w-full rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950" on:click={add}>Add Item</button>
      </div>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-black">Items</h3>
        <p class="text-sm text-slate-300">{items.length} items</p>
      </div>

      {#if !items.length}
        <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">No items found.</div>
      {:else}
        <div class="space-y-2">
          {#each items as item (item._rowNumber)}
            <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
              <div class="min-w-0">
                <p class="text-sm font-bold text-white">{item.item_name}</p>
                <p class="text-xs text-slate-400">{item.item_code} • {formatCurrency(item.unit_price)}</p>
              </div>
              <button
                type="button"
                class="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300"
                on:click={() => onDeleteItem(item._rowNumber)}
              >
                Delete
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>
