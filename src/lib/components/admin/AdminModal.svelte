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
      class="absolute inset-0 bg-[rgba(24,17,31,0.58)] backdrop-blur-sm"
      aria-label="Close admin panel"
      on:click={onClose}
    ></button>

    <div class="relative flex min-h-screen items-center justify-center p-4">
      <div class="surface-strong relative w-full max-w-6xl overflow-hidden rounded-[34px] text-[var(--text)]">
        <div class="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Hidden Admin</p>
            <h2 class="mt-1 text-2xl font-black">Operations Console</h2>
          </div>

          <button
            type="button"
            class="candy-button-secondary px-3 py-2 text-sm"
            on:click={onClose}
          >
            Close
          </button>
        </div>

        <div class="border-b border-[var(--border-soft)] px-4 py-3 sm:px-6">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class={`candy-tab ${currentTab === 'items' ? 'candy-tab-active' : 'candy-tab-inactive'}`}
              on:click={() => onTabChange('items')}
            >
              Items
            </button>
            <button
              type="button"
              class={`candy-tab ${currentTab === 'staff' ? 'candy-tab-active' : 'candy-tab-inactive'}`}
              on:click={() => onTabChange('staff')}
            >
              Staff
            </button>
            <button
              type="button"
              class={`candy-tab ${currentTab === 'transactions' ? 'candy-tab-active' : 'candy-tab-inactive'}`}
              on:click={() => onTabChange('transactions')}
            >
              Transactions
            </button>
            <button
              type="button"
              class={`candy-tab ${currentTab === 'faker' ? 'candy-tab-active' : 'candy-tab-inactive'}`}
              on:click={() => onTabChange('faker')}
            >
              Faker
            </button>
          </div>
        </div>

        <div class="max-h-[75vh] overflow-y-auto p-4 sm:p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}
