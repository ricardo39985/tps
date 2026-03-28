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
    <input bind:value={query} type="text" placeholder="Search transactions" class="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
    <input bind:value={date} type="date" class="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
    <select bind:value={staffName} class="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none">
      <option value="">All staff</option>
      {#each staff as member}
        <option value={member.name}>{member.name}</option>
      {/each}
    </select>
    <button type="button" class="rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950" on:click={search}>Search</button>
  </div>

  <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-black">Transactions</h3>
      <p class="text-sm text-slate-300">{transactions.length} results</p>
    </div>

    {#if !transactions.length}
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">No transactions found.</div>
    {:else}
      <div class="space-y-2">
        {#each transactions.slice(0, 100) as txn (txn._rowNumber)}
          <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-white">{txn.item_name} • {formatCurrency(txn.total_price)}</p>
              <p class="truncate text-xs text-slate-400">
                {txn.transaction_id} • {txn.date} {txn.time} • {txn.staff_name} • qty {txn.quantity}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300"
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
