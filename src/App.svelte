<script>
  import { onMount } from 'svelte';
  import CatalogGrid from './lib/components/CatalogGrid.svelte';
  import CheckoutPanel from './lib/components/CheckoutPanel.svelte';
  import DashboardSummary from './lib/components/DashboardSummary.svelte';
  import DashboardOverview from './lib/components/dashboard/DashboardOverview.svelte';
  import AdminModal from './lib/components/admin/AdminModal.svelte';
  import FakerTab from './lib/components/admin/FakerTab.svelte';
  import ItemsTab from './lib/components/admin/ItemsTab.svelte';
  import StaffTab from './lib/components/admin/StaffTab.svelte';
  import TransactionsTab from './lib/components/admin/TransactionsTab.svelte';
  import {
    adminOpen,
    adminTab,
    adminTransactionResults,
    addItem,
    addStaffMember,
    addToBasket,
    basket,
    basketDistinctCount,
    basketItemCount,
    basketTotal,
    closeAdmin,
    dashboard,
    deleteItem,
    deleteStaffMember,
    deleteTransaction,
    items,
    loadCoreData,
    loading,
    loadingMessage,
    liveClock,
    openAdmin,
    removeFromBasket,
    selectedStaff,
    uiTheme,
    setAdminTab,
    setSelectedStaff,
    staff,
    generateFakeTransactions,
    startClock,
    status,
    submitSale,
    toast,
    transactions,
    updateBasketQuantity,
    searchAdminTransactions
  } from './lib/state/app-state.js';
  import {
    clearDashboardFilters,
    dashboardInsights,
    setDashboardProductFilter,
    setDashboardStaffFilter
  } from './lib/state/dashboard-state.js';

  let searchQuery = '';
  let activeTab = 'checkout';
  let theme = 'light';
  let clockCleanup = null;

  function applyTheme(nextTheme) {
    theme = nextTheme === 'dark' ? 'dark' : 'light';
    uiTheme.set(theme);

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tps-theme', theme);
    }
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  $: filteredItems = searchQuery.trim()
    ? $items.filter((item) => {
        const query = searchQuery.trim().toLowerCase();
        return (
          String(item.item_name || '').toLowerCase().includes(query) ||
          String(item.item_code || '').toLowerCase().includes(query) ||
          String(item.description || '').toLowerCase().includes(query)
        );
      })
    : $items;

  $: firstItem = $basket[0] || null;
  $: basketSummary = {
    itemCount: $basketItemCount,
    distinctCount: $basketDistinctCount,
    total: $basketTotal
  };

  function handleSearch(value) {
    searchQuery = value;
  }

  function setActiveTab(tab) {
    activeTab = tab;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitSale();
  }

  onMount(() => {
    const storedTheme = localStorage.getItem('tps-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

    loadCoreData();
    clockCleanup = startClock();

    const handleKeyboard = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        if ($adminOpen) {
          closeAdmin();
        } else {
          openAdmin();
        }
      }

      if (event.key === 'Escape' && $adminOpen) {
        closeAdmin();
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      if (clockCleanup) {
        clockCleanup();
      }
    };
  });
</script>

<svelte:head>
  <title>NovaMart TPS POS</title>
</svelte:head>

<div class="relative overflow-hidden">
  <div class="pointer-events-none absolute inset-0">
    <div class="absolute -left-24 top-8 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,127,169,0.26),transparent_70%)] blur-3xl"></div>
    <div class="absolute right-[-5rem] top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(110,221,247,0.22),transparent_68%)] blur-3xl"></div>
    <div class="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(194,157,253,0.16),transparent_66%)] blur-3xl"></div>
  </div>

  <main class="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
    <header class="surface hero-panel mb-5 overflow-hidden rounded-[34px] p-5 sm:p-6 lg:p-7">
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),transparent_35%,rgba(255,255,255,0.06)_72%)]"></div>
      <div class="relative flex flex-col gap-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div class="max-w-3xl">
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span class="candy-pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                TPS + MIS Demo
              </span>

              <span class="candy-pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-3)]">
                Live Point of Sale
              </span>
            </div>

            <h1 class="text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">NovaMart Checkout Console</h1>

          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="icon-button h-12 w-12"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              on:click={toggleTheme}
            >
              {#if theme === 'dark'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[var(--accent-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25M12 18.75V21M4.22 4.22l1.59 1.59M18.19 18.19l1.59 1.59M3 12h2.25M18.75 12H21M4.22 19.78l1.59-1.59M18.19 5.81l1.59-1.59M12 7.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Z" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 14.25A9 9 0 1 1 9.75 2.25a7.5 7.5 0 0 0 12 12Z" />
                </svg>
              {/if}
            </button>

            <button
              type="button"
              class="candy-button-secondary h-12 px-4 text-sm"
              aria-label="Open admin"
              on:click={openAdmin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 11V7a4 4 0 0 1 8 0v4m-8 0h8m-8 0a4 4 0 1 0 8 0m-8 0v6a4 4 0 1 0 8 0v-6" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="surface-soft rounded-[24px] p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Date</p>
            <p class="mt-2 text-sm font-semibold text-[var(--text)]">{ $liveClock.date }</p>
          </div>
          <div class="surface-soft rounded-[24px] p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Time</p>
            <p class="mt-2 text-sm font-semibold text-[var(--text)]">{ $liveClock.time }</p>
          </div>
          <div class="surface-soft rounded-[24px] p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Items</p>
            <p class="mt-2 text-sm font-semibold text-[var(--text)]">{ $items.length }</p>
          </div>
          <div class="surface-soft rounded-[24px] p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Status</p>
            <p class="mt-2 text-sm font-semibold text-emerald-500">Ready</p>
          </div>
        </div>
      </div>
    </header>

    <div class="surface mb-5 flex flex-wrap items-center gap-2 rounded-[28px] p-2">
      <button
        type="button"
        class={`candy-tab min-w-[150px] flex-1 ${activeTab === 'checkout' ? 'candy-tab-active' : 'candy-tab-inactive'}`}
        on:click={() => setActiveTab('checkout')}
      >
        Checkout
      </button>

      <button
        type="button"
        class={`candy-tab min-w-[150px] flex-1 ${activeTab === 'dashboard' ? 'candy-tab-active' : 'candy-tab-inactive'}`}
        on:click={() => setActiveTab('dashboard')}
      >
        Dashboard
      </button>
    </div>

    {#if activeTab === 'dashboard'}
      <DashboardSummary
        dashboard={$dashboard}
        liveDate={$liveClock.date}
        liveTime={$liveClock.time}
        itemsCount={$items.length}
        firstItem={firstItem}
        cartItemCount={basketSummary.itemCount}
        cartTotal={basketSummary.total}
      />

      <div class="mb-6 mt-5">
        <DashboardOverview
          dashboard={$dashboardInsights}
          onProductChange={setDashboardProductFilter}
          onStaffChange={setDashboardStaffFilter}
          onClearFilters={clearDashboardFilters}
        />
      </div>
    {:else}
      <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.95fr)]">
        <CatalogGrid
          items={filteredItems}
          basket={$basket}
          query={searchQuery}
          onSearch={handleSearch}
          onAdd={addToBasket}
        />

        <aside class="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <CheckoutPanel
            basket={$basket}
            staffList={$staff}
            selectedStaff={$selectedStaff}
            total={$basketTotal}
            totalQuantity={$basketItemCount}
            statusMessage={$status.message}
            statusTone={$status.tone}
            onStaffChange={setSelectedStaff}
            onSubmit={handleSubmit}
            onIncrease={(itemCode) => updateBasketQuantity(itemCode, 1)}
            onDecrease={(itemCode) => updateBasketQuantity(itemCode, -1)}
            onRemove={removeFromBasket}
          />
        </aside>
      </div>
    {/if}
  </main>

  {#if $toast.visible}
    <div class="pointer-events-none fixed bottom-5 right-5 z-50 translate-y-0 opacity-100">
      <div class="surface-strong rounded-2xl px-5 py-4">
        <p class="text-sm font-bold text-emerald-500">{$toast.title}</p>
        <p class="mt-1 text-xs text-[var(--muted)]">{$toast.subtitle}</p>
      </div>
    </div>
  {/if}

  {#if $loading}
    <div class="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(35,23,49,0.44)] px-4 backdrop-blur-sm">
      <div class="surface-strong flex flex-col items-center gap-4 rounded-[32px] px-8 py-7 text-center">
        <div class="h-14 w-14 animate-spin rounded-full border-4 border-[color-mix(in_srgb,var(--accent)_28%,transparent)] border-t-[var(--accent)]"></div>
        <p class="text-sm font-semibold text-[var(--text)]">{$loadingMessage}</p>
      </div>
    </div>
  {/if}

  <AdminModal open={$adminOpen} currentTab={$adminTab} onClose={closeAdmin} onTabChange={setAdminTab}>
    {#if $adminTab === 'items'}
      <ItemsTab items={$items} onAddItem={addItem} onDeleteItem={deleteItem} />
    {:else if $adminTab === 'staff'}
      <StaffTab staff={$staff} onAddStaff={addStaffMember} onDeleteStaff={deleteStaffMember} />
    {:else if $adminTab === 'transactions'}
      <TransactionsTab
        transactions={$adminTransactionResults ?? $transactions}
        staff={$staff}
        onSearch={searchAdminTransactions}
        onDeleteTransaction={deleteTransaction}
      />
    {:else}
      <FakerTab items={$items} staff={$staff} onGenerate={generateFakeTransactions} />
    {/if}
  </AdminModal>
</div>
