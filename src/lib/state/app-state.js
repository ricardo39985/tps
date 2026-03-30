import { derived, get, writable } from 'svelte/store';
import { formatCurrency } from '../utils/format.js';
import { formatDateISO, generateTransactionId, getCurrentDateISO, getCurrentTime, getDateISOYearsAgo, getLiveDateLabel, getLiveTimeLabel } from '../utils/time.js';
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
export const uiTheme = writable('light');
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
        'from-rose-400/25 to-pink-300/10',
        'from-sky-300/25 to-cyan-200/10',
        'from-amber-300/25 to-orange-200/10',
        'from-emerald-300/25 to-lime-200/10',
        'from-fuchsia-300/25 to-violet-200/10'
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

function pad2(value) {
  return String(value).padStart(2, '0');
}

function parseDateISO(dateString) {
  const [year, month, day] = String(dateString || '').split('-').map((part) => Number(part));
  return new Date(year, (month || 1) - 1, day || 1);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateISO(startISO, endISO) {
  const start = parseDateISO(startISO);
  const end = parseDateISO(endISO);
  const span = Math.max(end.getTime() - start.getTime(), 0);
  const randomOffset = Math.floor(Math.random() * (span + 1));
  return formatDateISO(new Date(start.getTime() + randomOffset));
}

function randomTime24() {
  const hour = randomInt(8, 20);
  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);
  return `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;
}

function getNextItemCodeFromItems(currentItems = []) {
  const highest = currentItems.reduce((max, item) => {
    const match = String(item?.item_code || '').trim().match(/^C(\d+)$/i);
    if (!match) return max;
    return Math.max(max, Number(match[1] || 0));
  }, 0);

  return `C${String(highest + 1).padStart(3, '0')}`;
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

export async function generateFakeTransactions({ allUsers = true, staffNames = [], count, startDate, endDate } = {}) {
  const requestedCount = Number(count);
  const currentItems = get(items);
  const currentStaff = get(staff);
  const today = getCurrentDateISO();
  const minStartDate = getDateISOYearsAgo(10);

  if (!Number.isInteger(requestedCount) || requestedCount <= 0) {
    setStatus('Fake generator: enter a positive whole number of transactions.', 'error');
    return { ok: false };
  }

  if (!startDate || !endDate) {
    setStatus('Fake generator: choose both a start date and an end date.', 'error');
    return { ok: false };
  }

  if (endDate > today) {
    setStatus('Fake generator: the end date cannot be later than today.', 'error');
    return { ok: false };
  }

  if (startDate < minStartDate) {
    setStatus('Fake generator: the start date must be within the last 10 years.', 'error');
    return { ok: false };
  }

  if (startDate > endDate) {
    setStatus('Fake generator: the start date cannot be later than the end date.', 'error');
    return { ok: false };
  }

  if (!currentItems.length) {
    setStatus('Fake generator: add at least one item before generating transactions.', 'error');
    return { ok: false };
  }

  if (!currentStaff.length) {
    setStatus('Fake generator: add at least one staff member before generating transactions.', 'error');
    return { ok: false };
  }

  const selectedStaffNames = Array.isArray(staffNames)
    ? staffNames.map((name) => String(name || '').trim()).filter(Boolean)
    : [];

  const staffPool = allUsers
    ? currentStaff
    : currentStaff.filter((member) => selectedStaffNames.includes(member.name));

  if (!staffPool.length) {
    setStatus('Fake generator: select at least one available staff member.', 'error');
    return { ok: false };
  }

  const transactionsToInsert = Array.from({ length: requestedCount }, (_, index) => {
    const item = currentItems[randomInt(0, currentItems.length - 1)];
    const staffMember = staffPool[randomInt(0, staffPool.length - 1)];
    const quantity = randomInt(1, 5);
    const unitPrice = Number(item.unit_price || 0);
    const totalPrice = unitPrice * quantity;

    return {
      transaction_id: `TXN-${Date.now()}-${index + 1}-${randomInt(1000, 9999)}`,
      date: randomDateISO(startDate, endDate),
      time: randomTime24(),
      staff_name: staffMember.name,
      item_code: item.item_code,
      item_name: item.item_name,
      description: item.description,
      unit_price: unitPrice.toFixed(2),
      quantity,
      total_price: totalPrice.toFixed(2)
    };
  });

  setLoading(true);
  setLoadingMessage('Generating fake transactions...');

  try {
    setStatus('Writing fake transactions to Google Sheets...', 'neutral');

    await postAction({
      action: 'createTransactionBatch',
      transactions: transactionsToInsert
    });

    await loadCoreData();
    setStatus(`Generated ${requestedCount} fake transactions.`, 'success');
    showToast('Fake data generated', `Added ${requestedCount} transaction${requestedCount === 1 ? '' : 's'}.`);
    return { ok: true, inserted: requestedCount };
  } catch (error) {
    setStatus(`Fake generation failed: ${error.message}`, 'error');
    return { ok: false };
  } finally {
    setLoading(false);
    setLoadingMessage('Loading data...');
  }
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

export async function addItem({ item_name, description, unit_price } = {}) {
  if (!item_name || !unit_price) {
    setStatus('Admin: item name and price are required.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage('Saving item...');

  try {
    const currentItems = get(items);
    const item_code = getNextItemCodeFromItems(currentItems);

    await postAction({
      action: 'createItem',
      item_code,
      item_name,
      description,
      unit_price: Number(unit_price).toFixed(2)
    });

    await loadCoreData();
    setStatus(`Item ${item_code} added.`, 'success');
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

export async function deleteTransactions(rowNumbers = []) {
  const normalizedRows = [...new Set(
    (Array.isArray(rowNumbers) ? rowNumbers : [])
      .map((rowNumber) => Number(rowNumber))
      .filter(Boolean)
  )];

  if (!normalizedRows.length) {
    setStatus('Delete failed: no transactions selected.', 'error');
    return { ok: false };
  }

  setLoading(true);
  setLoadingMessage(normalizedRows.length === 1 ? 'Deleting transaction...' : `Deleting ${normalizedRows.length} transactions...`);

  try {
    await Promise.all(
      normalizedRows.map((rowNumber) =>
        postAction({
          action: 'deleteTransaction',
          rowNumber
        })
      )
    );

    await loadCoreData();
    setStatus(
      normalizedRows.length === 1 ? 'Transaction deleted.' : `${normalizedRows.length} transactions deleted.`,
      'success'
    );
    showToast(
      normalizedRows.length === 1 ? 'Transaction deleted' : 'Transactions deleted',
      normalizedRows.length === 1 ? 'Removed 1 transaction.' : `Removed ${normalizedRows.length} transactions.`
    );
    return { ok: true };
  } catch (error) {
    setStatus(`Delete transactions failed: ${error.message}`, 'error');
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
