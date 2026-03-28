<script>
  import { onMount } from 'svelte';
  import { getCurrentDateISO, getDateISOYearsAgo } from '../../utils/time.js';

  export let items = [];
  export let staff = [];
  export let onGenerate = () => {};

  let allUsers = true;
  let selectedStaffNames = [];
  let fakeCount = 10;
  let startDate = '';
  let endDate = '';
  let busy = false;
  let feedback = '';
  let feedbackTone = 'neutral';
  let today = getCurrentDateISO();
  let minDate = getDateISOYearsAgo(10);

  onMount(() => {
    today = getCurrentDateISO();
    minDate = getDateISOYearsAgo(10);

    if (!startDate) {
      const defaultStart = new Date();
      defaultStart.setDate(defaultStart.getDate() - 7);
      startDate = defaultStart.toISOString().split('T')[0];
    }

    if (!endDate) {
      endDate = today;
    }

    if (!selectedStaffNames.length && staff.length) {
      selectedStaffNames = staff.map((member) => member.name);
    }
  });

  $: validationError = (() => {
    const requestedCount = Number(fakeCount);

    if (!items.length) return 'Add items before generating fake transactions.';
    if (!staff.length) return 'Add staff members before generating fake transactions.';
    if (!Number.isInteger(requestedCount) || requestedCount <= 0) return 'Enter a positive whole number of transactions.';
    if (!startDate || !endDate) return 'Choose both a start date and an end date.';
    if (endDate > today) return 'The end date cannot be later than today.';
    if (startDate < minDate) return 'The start date must be within the last 10 years.';
    if (startDate > endDate) return 'The start date cannot be later than the end date.';
    if (!allUsers && !selectedStaffNames.some((name) => staff.some((member) => member.name === name))) return 'Select at least one available staff member.';

    return '';
  })();

  async function execute() {
    if (validationError || busy) {
      feedback = validationError;
      feedbackTone = 'error';
      return;
    }

    busy = true;
    feedback = '';
    feedbackTone = 'neutral';

    const result = await onGenerate({
      allUsers,
      staffNames: selectedStaffNames,
      count: Number(fakeCount),
      startDate,
      endDate
    });

    if (result?.ok) {
      feedback = `Generated ${result.inserted} fake transactions.`;
      feedbackTone = 'success';
    } else {
      feedback = 'Fake transaction generation failed.';
      feedbackTone = 'error';
    }

    busy = false;
  }

  function toggleStaff(memberName) {
    if (selectedStaffNames.includes(memberName)) {
      selectedStaffNames = selectedStaffNames.filter((name) => name !== memberName);
    } else {
      selectedStaffNames = [...selectedStaffNames, memberName];
    }
  }

  function selectAllStaff() {
    selectedStaffNames = staff.map((member) => member.name);
  }
</script>

<section class="grid gap-6 lg:grid-cols-[380px_1fr]">
  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p class="text-xs uppercase tracking-[0.2em] text-cyan-300">Faker</p>
    <h3 class="mt-1 text-2xl font-black text-white">Generate fake transactions</h3>
    <p class="mt-2 text-sm text-slate-300">
      Create test transaction rows for a single staff member or for all users across a bounded date range.
    </p>

    <div class="mt-5 space-y-4">
      <label class="block space-y-2">
        <span class="text-sm font-semibold text-slate-200">User scope</span>
        <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
          <input type="checkbox" bind:checked={allUsers} class="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400" />
          <span>All users</span>
        </label>
        <div class="rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <div class="mb-3 flex items-center justify-between gap-3">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Pick staff members</p>
            <button
              type="button"
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={allUsers}
              on:click={selectAllStaff}
            >
              Select all
            </button>
          </div>
          <div class="grid gap-2 sm:grid-cols-2">
            {#each staff as member}
              <label class={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${selectedStaffNames.includes(member.name) ? 'border-cyan-400/40 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-200'} ${allUsers ? 'opacity-50' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedStaffNames.includes(member.name)}
                  disabled={allUsers}
                  class="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400"
                  on:change={() => toggleStaff(member.name)}
                />
                <span class="truncate">{member.name}</span>
              </label>
            {/each}
          </div>
          {#if !allUsers && !selectedStaffNames.length}
            <p class="mt-3 text-xs text-rose-300">Pick at least one staff member.</p>
          {/if}
        </div>
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-semibold text-slate-200">Fake transactions</span>
        <input bind:value={fakeCount} min="1" step="1" type="number" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block space-y-2">
          <span class="text-sm font-semibold text-slate-200">Start date</span>
          <input bind:value={startDate} min={minDate} max={today} type="date" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-semibold text-slate-200">End date</span>
          <input bind:value={endDate} min={minDate} max={today} type="date" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
        </label>
      </div>

      <button
        type="button"
        class="w-full rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
        disabled={busy || Boolean(validationError)}
        on:click={execute}
      >
        {busy ? 'Generating...' : 'Execute'}
      </button>

      <p class={`text-sm ${feedbackTone === 'success' ? 'text-emerald-300' : feedbackTone === 'error' ? 'text-rose-300' : 'text-slate-300'}`}>
        {validationError || feedback || 'Rows are appended through the existing transaction batch endpoint.'}
      </p>
    </div>
  </div>

  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-black">Preview rules</h3>
      <p class="text-sm text-slate-300">{items.length} items • {staff.length} staff</p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Transaction shape</p>
        <p class="mt-2 text-sm text-slate-200">Each generated row follows the existing transaction headers used by Google Sheets.</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Dates</p>
        <p class="mt-2 text-sm text-slate-200">Start date is limited to the last 10 years and end date cannot exceed today.</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Randomization</p>
        <p class="mt-2 text-sm text-slate-200">Random mix across items, times, quantities, and the selected staff scope.</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Write path</p>
        <p class="mt-2 text-sm text-slate-200">Execution uses the existing `createTransactionBatch` Apps Script action.</p>
      </div>
    </div>
  </div>
</section>
