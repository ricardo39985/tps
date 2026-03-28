<script>
  export let staff = [];
  export let onAddStaff = () => {};
  export let onDeleteStaff = () => {};

  let staffName = '';

  async function add() {
    const result = await onAddStaff(staffName);

    if (result?.ok) {
      staffName = '';
    }
  }
</script>

<section>
  <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
    <div class="surface-soft rounded-2xl p-4">
      <h3 class="text-lg font-black text-[var(--text)]">Add Staff</h3>
      <div class="mt-4 space-y-3">
        <input bind:value={staffName} type="text" placeholder="Staff name" class="candy-input" />
        <button type="button" class="candy-button-primary w-full px-4 py-3" on:click={add}>Add Staff</button>
      </div>
    </div>

    <div class="surface-soft rounded-2xl p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-black text-[var(--text)]">Staff</h3>
        <p class="text-sm text-[var(--muted)]">{staff.length} staff</p>
      </div>

      {#if !staff.length}
        <div class="surface-inner rounded-xl p-4 text-sm text-[var(--muted)]">No staff found.</div>
      {:else}
        <div class="space-y-2">
          {#each staff as member (member._rowNumber)}
            <div class="surface-inner flex items-center justify-between gap-3 rounded-xl px-4 py-3">
              <div class="min-w-0">
                <p class="text-sm font-bold text-[var(--text)]">{member.name}</p>
              </div>
              <button
                type="button"
                class="rounded-xl border border-rose-300/30 bg-rose-100/75 px-3 py-2 text-xs font-semibold text-rose-500"
                on:click={() => onDeleteStaff(member._rowNumber)}
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
