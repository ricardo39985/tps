<script>
  export let open = false;
  export let currentTab = 'items';
  export let onClose = () => {};
  export let onTabChange = () => {};
</script>

{#if open}
  <div class="fixed inset-0 z-[60]">
    <button
      type="button"
      class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      aria-label="Close admin panel"
      on:click={onClose}
    ></button>

    <div class="relative flex min-h-screen items-center justify-center p-4 mb-4">
      <div class="relative w-full max-w-6xl rounded-[28px] border border-white/10 bg-slate-900 text-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-cyan-300">Hidden Admin</p>
            <h2 class="mt-1 text-2xl font-black">Operations Console</h2>
          </div>

          <button
            type="button"
            class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            on:click={onClose}
          >
            Close
          </button>
        </div>

        <div class="border-b border-white/10 px-6 py-3">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class={`rounded-xl px-4 py-2 text-sm font-semibold ${currentTab === 'items' ? 'bg-cyan-400/15 text-cyan-200' : 'bg-white/5 text-slate-300'}`}
              on:click={() => onTabChange('items')}
            >
              Items
            </button>
            <button
              type="button"
              class={`rounded-xl px-4 py-2 text-sm font-semibold ${currentTab === 'staff' ? 'bg-cyan-400/15 text-cyan-200' : 'bg-white/5 text-slate-300'}`}
              on:click={() => onTabChange('staff')}
            >
              Staff
            </button>
            <button
              type="button"
              class={`rounded-xl px-4 py-2 text-sm font-semibold ${currentTab === 'transactions' ? 'bg-cyan-400/15 text-cyan-200' : 'bg-white/5 text-slate-300'}`}
              on:click={() => onTabChange('transactions')}
            >
              Transactions
            </button>
            <button
              type="button"
              class={`rounded-xl px-4 py-2 text-sm font-semibold ${currentTab === 'faker' ? 'bg-cyan-400/15 text-cyan-200' : 'bg-white/5 text-slate-300'}`}
              on:click={() => onTabChange('faker')}
            >
              Faker
            </button>
          </div>
        </div>

        <div class="max-h-[75vh] overflow-y-auto p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}
