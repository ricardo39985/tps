<script>
  export let open = false;
  export let currentTab = 'items';
  export let onClose = () => {};
  export let onTabChange = () => {};

  const tabs = [
    {
      id: 'items',
      label: 'Items',
      icon: 'grid'
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: 'users'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: 'receipt'
    },
    {
      id: 'faker',
      label: 'Faker',
      icon: 'sparkles'
    }
  ];
</script>

{#if open}
  <div class="fixed inset-0 z-[60]">
    <button
      type="button"
      class="absolute inset-0 bg-[rgba(24,17,31,0.58)] backdrop-blur-sm"
      aria-label="Close admin panel"
      on:click={onClose}
    ></button>

    <div class="relative flex min-h-screen items-end justify-center p-0 sm:items-center sm:p-4">
      <div class="surface-strong relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none text-[var(--text)] sm:h-auto sm:max-h-[92dvh] sm:max-w-6xl sm:rounded-[34px]">
        <div class="flex shrink-0 items-center justify-between border-b border-[var(--border-soft)] px-4 py-4 sm:px-6">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Hidden Admin</p>
            <h2 class="mt-1 text-xl font-black sm:text-2xl">Operations Console</h2>
          </div>

          <button
            type="button"
            class="candy-button-secondary px-3 py-2 text-sm"
            on:click={onClose}
          >
            Close
          </button>
        </div>

        <div class="shrink-0 border-b border-[var(--border-soft)] px-3 py-3 sm:px-6">
          <div class="flex gap-2 overflow-x-auto pb-1">
            {#each tabs as tab}
              <button
                type="button"
                class={`candy-tab admin-tab ${currentTab === tab.id ? 'candy-tab-active admin-tab-active' : 'candy-tab-inactive admin-tab-inactive'}`}
                aria-label={tab.label}
                aria-pressed={currentTab === tab.id}
                on:click={() => onTabChange(tab.id)}
              >
                {#if tab.icon === 'grid'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.75 5.75h5.5v5.5h-5.5zm9 0h5.5v5.5h-5.5zm-9 9h5.5v5.5h-5.5zm9 0h5.5v5.5h-5.5z" />
                  </svg>
                {:else if tab.icon === 'users'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 18.25a5.25 5.25 0 0 0-10.5 0m13.5-2.5a4 4 0 0 1 0 2.5m-2.25-10a3.25 3.25 0 1 1 0 6.5m-6.75-2a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z" />
                  </svg>
                {:else if tab.icon === 'receipt'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.75 4.75h8.5a2 2 0 0 1 2 2v12.5l-2.5-1.5-2.5 1.5-2.5-1.5-2.5 1.5V6.75a2 2 0 0 1 2-2Zm1.5 4.5h5.5m-5.5 3h5.5" />
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m12 3.75 1.23 3.77a1 1 0 0 0 .63.63l3.77 1.23-3.77 1.23a1 1 0 0 0-.63.63L12 15l-1.23-3.77a1 1 0 0 0-.63-.63L6.37 9.38l3.77-1.23a1 1 0 0 0 .63-.63L12 3.75Zm5.25 10.5.62 1.88a.75.75 0 0 0 .47.47l1.88.62-1.88.62a.75.75 0 0 0-.47.47l-.62 1.88-.62-1.88a.75.75 0 0 0-.47-.47l-1.88-.62 1.88-.62a.75.75 0 0 0 .47-.47l.62-1.88Z" />
                  </svg>
                {/if}

                {#if currentTab === tab.id}
                  <span>{tab.label}</span>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}
