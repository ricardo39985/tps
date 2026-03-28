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
  let clockCleanup = null;

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
    <div class="absolute -top-24 left-[-5rem] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
    <div class="absolute right-[-4rem] top-28 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
    <div class="absolute bottom-[-5rem] left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
  </div>

  <main class="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <header class="hero-panel mb-6 rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span class="rounded-full border border-cyan-400/30 bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              TPS + MIS Demo
            </span>

            <span class="rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Live Point of Sale
            </span>
          </div>

          <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">NovaMart Checkout Console</h1>
          <p class="text-balance mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            Select products, capture staff sales, submit transactions to Google Sheets, and present a polished TPS interface that actually looks worth showing.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[480px]">
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-300">Date</p>
            <p class="mt-2 text-sm font-semibold text-white">{ $liveClock.date }</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-300">Time</p>
            <p class="mt-2 text-sm font-semibold text-white">{ $liveClock.time }</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-300">Items</p>
            <p class="mt-2 text-sm font-semibold text-white">{ $items.length }</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-300">Status</p>
            <p class="mt-2 text-sm font-semibold text-emerald-300">Ready</p>
          </div>
        </div>
      </div>
    </header>

    <div class="mb-6 flex flex-wrap items-center gap-3 rounded-[24px] border border-white/10 bg-white/8 p-2 shadow-xl backdrop-blur-xl">
      <button
        type="button"
        class={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === 'checkout' ? 'bg-cyan-400/15 text-cyan-100 shadow-[0_10px_28px_rgba(34,211,238,0.12)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
        on:click={() => setActiveTab('checkout')}
      >
        Checkout
      </button>

      <button
        type="button"
        class={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-fuchsia-400/15 text-fuchsia-100 shadow-[0_10px_28px_rgba(217,70,239,0.12)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
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

      <div class="mb-6">
        <DashboardOverview
          dashboard={$dashboardInsights}
          onProductChange={setDashboardProductFilter}
          onStaffChange={setDashboardStaffFilter}
          onClearFilters={clearDashboardFilters}
        />
      </div>
    {:else}
      <div class="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <CatalogGrid
          items={filteredItems}
          basket={$basket}
          query={searchQuery}
          onSearch={handleSearch}
          onAdd={addToBasket}
        />

        <aside class="space-y-6">
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

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="justify-self-end rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
        aria-label="Open admin"
        on:click={openAdmin}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 11V7a4 4 0 0 1 8 0v4m-8 0h8m-8 0a4 4 0 1 0 8 0m-8 0v6a4 4 0 1 0 8 0v-6" />
        </svg>
      </button>
    </div>
  </main>

  {#if $toast.visible}
    <div class="pointer-events-none fixed bottom-5 right-5 z-50 translate-y-0 opacity-100">
      <div class="rounded-2xl border border-emerald-400/25 bg-slate-950/90 px-5 py-4 shadow-2xl backdrop-blur-xl">
        <p class="text-sm font-bold text-emerald-300">{$toast.title}</p>
        <p class="mt-1 text-xs text-slate-300">{$toast.subtitle}</p>
      </div>
    </div>
  {/if}

  {#if $loading}
    <div class="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/90 px-8 py-7 shadow-2xl">
        <div class="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400"></div>
        <p class="text-sm font-semibold text-white">{$loadingMessage}</p>
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
