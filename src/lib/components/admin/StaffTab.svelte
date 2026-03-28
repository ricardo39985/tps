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
    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 class="text-lg font-black">Add Staff</h3>
      <div class="mt-4 space-y-3">
        <input bind:value={staffName} type="text" placeholder="Staff name" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" />
        <button type="button" class="w-full rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950" on:click={add}>Add Staff</button>
      </div>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-black">Staff</h3>
        <p class="text-sm text-slate-300">{staff.length} staff</p>
      </div>

      {#if !staff.length}
        <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">No staff found.</div>
      {:else}
        <div class="space-y-2">
          {#each staff as member (member._rowNumber)}
            <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
              <div class="min-w-0">
                <p class="text-sm font-bold text-white">{member.name}</p>
              </div>
              <button
                type="button"
                class="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300"
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
