<script>
  import { formatCurrency } from '../../utils/format.js';

  export let transactions = [];
  export let staff = [];
  export let onSearch = () => {};
  export let onDeleteTransaction = () => {};

  let query = '';
  let date = '';
  let staffName = '';

  async function search() {
    await onSearch({
      query: query.trim(),
      date,
      staff_name: staffName
    });
  }
</script>

<section>
  <div class="grid gap-4 lg:grid-cols-[220px_220px_1fr_auto]">
    <input bind:value={query} type="text" placeholder="Search transactions" class="candy-input" />
    <input bind:value={date} type="date" class="candy-input" />
    <select bind:value={staffName} class="candy-select">
      <option value="">All staff</option>
      {#each staff as member}
        <option value={member.name}>{member.name}</option>
      {/each}
    </select>
    <button type="button" class="candy-button-primary px-4 py-3" on:click={search}>Search</button>
  </div>

  <div class="mt-6 surface-soft rounded-2xl p-4">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-black text-[var(--text)]">Transactions</h3>
      <p class="text-sm text-[var(--muted)]">{transactions.length} results</p>
    </div>

    {#if !transactions.length}
      <div class="surface-inner rounded-xl p-4 text-sm text-[var(--muted)]">No transactions found.</div>
    {:else}
      <div class="space-y-2">
        {#each transactions.slice(0, 100) as txn (txn._rowNumber)}
          <div class="surface-inner flex flex-col gap-3 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-[var(--text)]">{txn.item_name} • {formatCurrency(txn.total_price)}</p>
              <p class="truncate text-xs text-[var(--muted)]">
                {txn.transaction_id} • {txn.date} {txn.time} • {txn.staff_name} • qty {txn.quantity}
              </p>
            </div>
            <button
              type="button"
              class="rounded-xl border border-rose-300/30 bg-rose-100/75 px-3 py-2 text-xs font-semibold text-rose-500"
              on:click={() => onDeleteTransaction(txn._rowNumber)}
            >
              Delete
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
