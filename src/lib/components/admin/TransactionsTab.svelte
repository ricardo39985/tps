<script>
  import { formatCurrency } from '../../utils/format.js';
  import { getLiveDateLabel, formatTime } from '../../utils/time.js';

  export let transactions = [];
  export let staff = [];
  export let onSearch = () => {};
  export let onDeleteTransaction = () => {};
  export let onDeleteTransactions = () => {};

  let query = '';
  let date = '';
  let staffName = '';
  let selectedRows = [];

  $: visibleTransactions = transactions;
  $: visibleRowNumbers = visibleTransactions.map((txn) => Number(txn._rowNumber)).filter(Boolean);
  $: selectedRows = selectedRows.filter((rowNumber) => visibleRowNumbers.includes(rowNumber));
  $: allVisibleSelected = visibleRowNumbers.length > 0 && visibleRowNumbers.every((rowNumber) => selectedRows.includes(rowNumber));

  async function search() {
    await onSearch({
      query: query.trim(),
      date,
      staff_name: staffName
    });
  }

  function toggleSelection(rowNumber) {
    const normalized = Number(rowNumber);

    if (!normalized) return;

    selectedRows = selectedRows.includes(normalized)
      ? selectedRows.filter((value) => value !== normalized)
      : [...selectedRows, normalized];
  }

  function toggleSelectAll() {
    selectedRows = allVisibleSelected ? [] : [...visibleRowNumbers];
  }

  async function deleteSelected() {
    if (!selectedRows.length) return;

    const result = await onDeleteTransactions(selectedRows);

    if (result?.ok) {
      selectedRows = [];
    }
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
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-black text-[var(--text)]">Transactions</h3>
        <p class="text-sm text-[var(--muted)]">{transactions.length} results</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="candy-button-secondary px-4 py-2 text-sm"
          on:click={toggleSelectAll}
          disabled={!visibleTransactions.length}
        >
          {allVisibleSelected ? 'Clear selection' : 'Select all'}
        </button>

        <button
          type="button"
          class="rounded-full border border-rose-300/30 bg-rose-100/75 px-4 py-2 text-sm font-semibold text-rose-500 transition disabled:cursor-not-allowed disabled:opacity-50"
          on:click={deleteSelected}
          disabled={!selectedRows.length}
        >
          Delete selected ({selectedRows.length})
        </button>
      </div>
    </div>

    {#if !transactions.length}
      <div class="surface-inner rounded-xl p-4 text-sm text-[var(--muted)]">No transactions found.</div>
    {:else}
      <div class="space-y-2">
        {#each visibleTransactions as txn (txn._rowNumber)}
          <div class="surface-inner flex flex-col gap-3 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-start gap-3">
              <input
                type="checkbox"
                class="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                checked={selectedRows.includes(Number(txn._rowNumber))}
                aria-label={`Select transaction ${txn.transaction_id}`}
                on:change={() => toggleSelection(txn._rowNumber)}
              />

              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-[var(--text)]">{txn.item_name} • {formatCurrency(txn.total_price)}</p>
                <p class="truncate text-xs text-[var(--muted)]">
                  {txn.transaction_id} • {getLiveDateLabel(new Date(txn.date))} {formatTime(txn.time)} • {txn.staff_name} • qty {txn.quantity}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="rounded-xl border border-rose-300/30 bg-rose-100/75 px-3 py-2 text-xs font-semibold text-rose-500"
              on:click={async () => {
                const result = await onDeleteTransaction(txn._rowNumber);

                if (result?.ok) {
                  selectedRows = selectedRows.filter((value) => value !== Number(txn._rowNumber));
                }
              }}
            >
              Delete
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
