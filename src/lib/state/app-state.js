import { derived, get, writable } from 'svelte/store';
import { formatCurrency } from '../utils/format.js';
import { generateTransactionId, getCurrentDateISO, getCurrentTime, getLiveDateLabel, getLiveTimeLabel } from '../utils/time.js';
import {
  getDashboardSummary,
  getItems,
  getStaff,
  getTransactions,
  postAction,
  searchTransactions as searchTransactionsRequest,
} from '../data/service.js';

export const items = writable([]);
export const staff = writable([]);
export const transactions = writable([]);
export const dashboard = writable(null);
export const basket = writable([]);
export const adminOpen = writable(false);
export const adminTab = writable('items');
export const loading = writable(false);
export const loadingMessage = writable('Loading data...');
export const status = writable({ message: 'Loading data...', tone: 'neutral' });
export const selectedStaff = writable('');
export const liveClock = writable({
  date: '--',
  time: '--'
});
export const toast = writable({
  visible: false,
  title: '',
  subtitle: ''
});
export const adminTransactionResults = writable(null);

export const basketDistinctCount = derived(basket, ($basket) => $basket.length);
export const basketItemCount = derived(basket, ($basket) => $basket.reduce((sum, item) => sum + item.quantity, 0));
export const basketTotal = derived(basket, ($basket) => $basket.reduce((sum, item) => sum + item.quantity * item.unit_price, 0));

let toastTimer = null;
let clockTimer = null;

function setStatus(message, tone = 'neutral') {
  status.set({ message, tone });
}

function setLoading(isLoading) {
  loading.set(Boolean(isLoading));
}

function setLoadingMessage(message) {
  loadingMessage.set(message);
}

function showToast(title, subtitle) {
  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toast.set({
    visible: true,
    title,
    subtitle
  });

  toastTimer = setTimeout(() => {
    toast.set({
      visible: false,
      title: '',
      subtitle: ''
    });
  }, 2400);
}

export function startClock() {
  const update = () => {
    const now = new Date();
    liveClock.set({
      date: getLiveDateLabel(now),
      time: getLiveTimeLabel(now)
    });
  };

  update();

  if (clockTimer) {
    clearInterval(clockTimer);
  }

  clockTimer = setInterval(update, 1000);

  return () => {
    if (clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
  };
}

export async function loadCoreData() {
  setLoading(true);
  setLoadingMessage('Loading data...');
  setStatus('Loading data...', 'neutral');

  try {
    const [itemsResult, staffResult, dashboardResult, transactionsResult] = await Promise.all([
      getItems(),
      getStaff(),
      getDashboardSummary(),
      getTransactions()
    ]);

    if (!itemsResult.success) throw new Error(itemsResult.error || 'Failed to load items.');
    if (!staffResult.success) throw new Error(staffResult.error || 'Failed to load staff.');
    if (!dashboardResult.success) throw new Error(dashboardResult.error || 'Failed to load dashboard.');
    if (!transactionsResult.success) throw new Error(transactionsResult.error || 'Failed to load transactions.');

    items.set((itemsResult.items || []).map((item, index) => ({
      _rowNumber: Number(item._rowNumber),
      item_code: item.item_code,
      item_name: item.item_name,
      description: item.description,
      unit_price: Number(item.unit_price || 0),
      accent: [
        'from-cyan-500/25 to-sky-500/10',
        'from-blue-500/25 to-indigo-500/10',
        'from-amber-500/25 to-orange-500/10',
        'from-emerald-500/25 to-teal-500/10',
        'from-fuchsia-500/25 to-violet-500/10'
      ][index % 5]
    })));

    staff.set(staffResult.staff || []);
    dashboard.set(dashboardResult.dashboard || null);
    transactions.set(transactionsResult.transactions || []);
    adminTransactionResults.set(null);
    setStatus('Ready.', 'success');
  } catch (error) {
    setStatus(`Failed to initialize app: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
}

export function setAdminTab(tabName) {
  adminTab.set(tabName);
}

export function openAdmin() {
  adminOpen.set(true);
}

export function closeAdmin() {
  adminOpen.set(false);
}

export function addToBasket(itemCode) {
  const currentItems = get(items);
  const item = currentItems.find((entry) => entry.item_code === itemCode);

  if (!item) return;

  basket.update((currentBasket) => {
    const existing = currentBasket.find((entry) => entry.item_code === itemCode);

    if (existing) {
      return currentBasket.map((entry) =>
        entry.item_code === itemCode
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry
      );
    }

    return [
      ...currentBasket,
      {
        ...item,
        quantity: 1
      }
    ];
  });
}

export function updateBasketQuantity(itemCode, delta) {
  basket.update((currentBasket) => {
    const nextBasket = currentBasket
      .map((entry) =>
        entry.item_code === itemCode
          ? { ...entry, quantity: entry.quantity + delta }
          : entry
      )
      .filter((entry) => entry.quantity > 0);

    return nextBasket;
  });
}

export function removeFromBasket(itemCode) {
  basket.update((currentBasket) => currentBasket.filter((entry) => entry.item_code !== itemCode));
}

export function clearBasket() {
  basket.set([]);
}

export function setSelectedStaff(name) {
  selectedStaff.set(name);
}

export function formatBasketTotalForStatus() {
  return formatCurrency(get(basketTotal));
}

export async function submitSale() {
  const currentBasket = get(basket);
  const staffName = get(selectedStaff).trim();

  if (!currentBasket.length) {
    setStatus('Add at least one item to the cart before submitting.', 'error');
    return { ok: false };
  }

  if (!staffName) {
    setStatus('Enter the staff name to continue.', 'error');
    return { ok: false };
  }

  const transactionId = generateTransactionId();
  const date = getCurrentDateISO();
  const time = getCurrentTime();

  setLoading(true);
  setLoadingMessage('Writing to Google Sheets...');

  try {
    setStatus('Submitting transaction to Google Sheets...', 'neutral');

    await postAction({
      action: 'createTransactionBatch',
      transactions: currentBasket.map((item) => ({
        transaction_id: transactionId,
        date,
        time,
        staff_name: staffName,
        item_code: item.item_code,
        item_name: item.item_name,
        description: item.description,
        unit_price: Number(item.unit_price).toFixed(2),
        quantity: item.quantity,
        total_price: (item.quantity * item.unit_price).toFixed(2)
      }))
    });

    setStatus('Cart submitted. Verify the grouped rows in Google Sheets.', 'success');
    showToast('Transaction submitted', 'The sale was sent to Google Sheets.');
    clearBasket();
    selectedStaff.set('');
    await loadCoreData();
    return { ok: true };
  } catch (error) {
    setStatus(`Submission failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
}

export async function addItem({ item_code, item_name, description, unit_price }) {
  if (!item_code || !item_name || !unit_price) {
    setStatus('Admin: item code, item name, and price are required.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage('Saving item...');

  try {
    await postAction({
      action: 'createItem',
      item_code,
      item_name,
      description,
      unit_price: Number(unit_price).toFixed(2)
    });

    await loadCoreData();
    setStatus('Item added.', 'success');
    return { ok: true };
  } catch (error) {
    setStatus(`Add item failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
}

export async function deleteItem(rowNumber) {
  const normalized = Number(rowNumber);

  if (!normalized) {
    setStatus('Delete failed: invalid item row.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage('Deleting item...');

  try {
    await postAction({
      action: 'deleteItem',
      rowNumber: normalized
    });

    await loadCoreData();
    setStatus('Item deleted.', 'success');
    return { ok: true };
  } catch (error) {
    setStatus(`Delete item failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
}

export async function addStaffMember(name) {
  const trimmed = name.trim();

  if (!trimmed) {
    setStatus('Admin: staff name is required.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage('Saving staff...');

  try {
    await postAction({
      action: 'createStaff',
      name: trimmed
    });

    await loadCoreData();
    setStatus('Staff added.', 'success');
    return { ok: true };
  } catch (error) {
    setStatus(`Add staff failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
}

export async function deleteStaffMember(rowNumber) {
  const normalized = Number(rowNumber);

  if (!normalized) {
    setStatus('Delete failed: invalid staff row.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage('Deleting staff...');

  try {
    await postAction({
      action: 'deleteStaff',
      rowNumber: normalized
    });

    await loadCoreData();
    setStatus('Staff deleted.', 'success');
    return { ok: true };
  } catch (error) {
    setStatus(`Delete staff failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
}

export async function deleteTransaction(rowNumber) {
  const normalized = Number(rowNumber);

  if (!normalized) {
    setStatus('Delete failed: invalid transaction row.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage('Deleting transaction...');

  try {
    await postAction({
      action: 'deleteTransaction',
      rowNumber: normalized
    });

    await loadCoreData();
    setStatus('Transaction deleted.', 'success');
    return { ok: true };
  } catch (error) {
    setStatus(`Delete transaction failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
}

export async function searchAdminTransactions({ query = '', date = '', staff_name = '' } = {}) {
  setLoading(true);
  setLoadingMessage('Searching transactions...');

  try {
    const result = await searchTransactionsRequest({ query, date, staff_name });

    if (!result.success) {
      throw new Error(result.error || 'Search failed.');
    }

    adminTransactionResults.set(result.transactions || []);
    return result.transactions || [];
  } catch (error) {
    setStatus(`Search failed: ${error.message}`, 'error');
    adminTransactionResults.set([]);
    return [];
  } finally {
    setLoading(false);
  }
}
