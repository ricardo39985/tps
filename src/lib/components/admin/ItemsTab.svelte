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
    <div class="surface-soft rounded-2xl p-4">
      <h3 class="text-lg font-black text-[var(--text)]">Add Item</h3>
      <div class="mt-4 space-y-3">
        <div class="surface-inner rounded-xl px-4 py-3">
          <p class="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Item code</p>
          <p class="mt-1 text-sm font-semibold text-[var(--text)]">{nextItemCode}</p>
        </div>
        <input bind:value={itemName} type="text" placeholder="Item name" class="candy-input" />
        <input bind:value={description} type="text" placeholder="Description" class="candy-input" />
        <input bind:value={itemPrice} type="number" step="0.01" placeholder="Unit price" class="candy-input" />
        <button type="button" class="candy-button-primary w-full px-4 py-3" on:click={add}>Add Item</button>
      </div>
    </div>

    <div class="surface-soft rounded-2xl p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-black text-[var(--text)]">Items</h3>
        <p class="text-sm text-[var(--muted)]">{items.length} items</p>
      </div>

      {#if !items.length}
        <div class="surface-inner rounded-xl p-4 text-sm text-[var(--muted)]">No items found.</div>
      {:else}
        <div class="space-y-2">
          {#each items as item (item._rowNumber)}
            <div class="surface-inner flex items-center justify-between gap-3 rounded-xl px-4 py-3">
              <div class="min-w-0">
                <p class="text-sm font-bold text-[var(--text)]">{item.item_name}</p>
                <p class="text-xs text-[var(--muted)]">{item.item_code} • {formatCurrency(item.unit_price)}</p>
              </div>
              <button
                type="button"
                class="rounded-xl border border-rose-300/30 bg-rose-100/75 px-3 py-2 text-xs font-semibold text-rose-500"
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
