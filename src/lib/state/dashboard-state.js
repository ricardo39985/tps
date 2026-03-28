import { derived, writable } from 'svelte/store';
import { formatCurrency } from '../utils/format.js';
import { normalizeDashboardLabel, uniqueDashboardLabels } from '../utils/dashboard.js';
import { items, loading, staff, transactions, uiTheme } from './app-state.js';

export const dashboardProductFilter = writable('all');
export const dashboardStaffFilter = writable('all');

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildTransactionRecord(transaction) {
  return {
    ...transaction,
    productLabel: normalizeDashboardLabel(transaction.item_name || transaction.item_code),
    staffLabel: normalizeDashboardLabel(transaction.staff_name),
    dateLabel: normalizeDashboardLabel(transaction.date),
    revenue: toNumber(transaction.total_price),
    quantity: toNumber(transaction.quantity)
  };
}

function aggregateByKey(records, keySelector) {
  const map = new Map();

  records.forEach((record) => {
    const key = keySelector(record);
    const current = map.get(key) || {
      key,
      label: key,
      revenue: 0,
      units: 0,
      transactions: 0
    };

    current.revenue += record.revenue;
    current.units += record.quantity;
    current.transactions += 1;
    map.set(key, current);
  });

  return [...map.values()].sort((a, b) => {
    if (b.revenue !== a.revenue) return b.revenue - a.revenue;
    if (b.transactions !== a.transactions) return b.transactions - a.transactions;
    return a.label.localeCompare(b.label);
  });
}

function aggregateByDate(records) {
  const map = new Map();

  records.forEach((record) => {
    const key = record.dateLabel;
    const current = map.get(key) || {
      key,
      label: key,
      revenue: 0,
      units: 0,
      transactions: 0
    };

    current.revenue += record.revenue;
    current.units += record.quantity;
    current.transactions += 1;
    map.set(key, current);
  });

  return [...map.values()].sort((a, b) => String(a.label).localeCompare(String(b.label)));
}

function buildFilterOptions(baseValues, transactionValues) {
  const labels = uniqueDashboardLabels([...baseValues, ...transactionValues]);
  return labels.map((label) => ({ value: label, label }));
}

function addCounts(options, records, keySelector) {
  const counts = new Map();

  records.forEach((record) => {
    const key = keySelector(record);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return options.map((option) => ({
    ...option,
    count: counts.get(option.value) || 0
  }));
}

function buildChartTheme(theme = 'light') {
  if (theme === 'dark') {
    return {
      borderColor: 'rgba(255, 145, 194, 0.95)',
      gridColor: 'rgba(255, 255, 255, 0.08)',
      tickColor: 'rgba(255, 242, 249, 0.88)'
    };
  }

  return {
    borderColor: 'rgba(255, 127, 169, 0.95)',
    gridColor: 'rgba(131, 112, 132, 0.12)',
    tickColor: 'rgba(74, 54, 78, 0.86)'
  };
}

function buildRevenueTrendChart(records, themeName) {
  const theme = buildChartTheme(themeName);
  const daily = aggregateByDate(records);

  return {
    data: {
      labels: daily.map((entry) => entry.label),
      datasets: [
        {
          label: 'Revenue',
          data: daily.map((entry) => entry.revenue),
          borderColor: theme.borderColor,
          backgroundColor: themeName === 'dark' ? 'rgba(255, 145, 194, 0.16)' : 'rgba(255, 127, 169, 0.16)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: theme.borderColor
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ${formatCurrency(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: theme.tickColor },
          grid: { color: theme.gridColor }
        },
        y: {
          ticks: {
            color: theme.tickColor,
            callback: (value) => formatCurrency(value)
          },
          grid: { color: theme.gridColor }
        }
      }
    }
  };
}

function buildHorizontalBarChart(records, label, color, fallbackColor, themeName) {
  const theme = buildChartTheme(themeName);
  const sliced = records.slice(0, 5);

  return {
    data: {
      labels: sliced.map((entry) => entry.label),
      datasets: [
        {
          label,
          data: sliced.map((entry) => entry.revenue),
          backgroundColor: sliced.map((_, index) => color[index % color.length] || fallbackColor),
          borderRadius: 14,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ${formatCurrency(context.parsed.x)}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: theme.tickColor,
            callback: (value) => formatCurrency(value)
          },
          grid: { color: theme.gridColor }
        },
        y: {
          ticks: { color: theme.tickColor },
          grid: { color: 'transparent' }
        }
      }
    }
  };
}

function buildMetrics(records, totalProducts, totalStaff) {
  const revenue = records.reduce((sum, record) => sum + record.revenue, 0);
  const transactionsCount = records.length;
  const unitsSold = records.reduce((sum, record) => sum + record.quantity, 0);
  const averageOrderValue = transactionsCount ? revenue / transactionsCount : 0;
  const activeProducts = new Set(records.map((record) => record.productLabel)).size;
  const activeStaff = new Set(records.map((record) => record.staffLabel)).size;

  return {
    revenue,
    transactions: transactionsCount,
    unitsSold,
    averageOrderValue,
    activeProducts,
    activeStaff,
    totalProducts,
    totalStaff
  };
}

export const dashboardInsights = derived(
  [items, staff, transactions, loading, dashboardProductFilter, dashboardStaffFilter, uiTheme],
  ([$items, $staff, $transactions, $loading, $productFilter, $staffFilter, $uiTheme]) => {
    const normalizedTransactions = ($transactions || []).map(buildTransactionRecord);
    const itemLabels = ($items || []).map((item) => normalizeDashboardLabel(item.item_name || item.item_code));
    const staffLabels = ($staff || []).map((member) => normalizeDashboardLabel(member.name));

    const productOptions = addCounts(
      buildFilterOptions(itemLabels, normalizedTransactions.map((record) => record.productLabel)),
      normalizedTransactions,
      (record) => record.productLabel
    );

    const staffOptions = addCounts(
      buildFilterOptions(staffLabels, normalizedTransactions.map((record) => record.staffLabel)),
      normalizedTransactions,
      (record) => record.staffLabel
    );

    const filteredTransactions = normalizedTransactions.filter((record) => {
      const matchesProduct = $productFilter === 'all' || record.productLabel === $productFilter;
      const matchesStaff = $staffFilter === 'all' || record.staffLabel === $staffFilter;
      return matchesProduct && matchesStaff;
    });

    const allProducts = aggregateByKey(normalizedTransactions, (record) => record.productLabel);
    const allStaff = aggregateByKey(normalizedTransactions, (record) => record.staffLabel);
    const filteredProducts = aggregateByKey(filteredTransactions, (record) => record.productLabel);
    const filteredStaff = aggregateByKey(filteredTransactions, (record) => record.staffLabel);

    const metrics = buildMetrics(filteredTransactions, productOptions.length, staffOptions.length);
    const hasFilters = $productFilter !== 'all' || $staffFilter !== 'all';
    const filterSummary = [
      $productFilter === 'all' ? 'All products' : $productFilter,
      $staffFilter === 'all' ? 'All staff' : $staffFilter
    ].join(' • ');

    const noResultsMessage = hasFilters
      ? 'No transactions match the selected product and staff filters.'
      : normalizedTransactions.length
        ? 'No transactions are available in the current sheet data.'
        : 'No transaction data has been loaded yet.';

    return {
      loading: Boolean($loading),
      hasData: normalizedTransactions.length > 0,
      hasFilters,
      filterSummary,
      productFilter: $productFilter,
      staffFilter: $staffFilter,
      productOptions,
      staffOptions,
      filteredTransactions,
      metrics,
      topProducts: filteredProducts.slice(0, 5),
      topStaff: filteredStaff.slice(0, 5),
      allProducts,
      allStaff,
      revenueTrendChart: buildRevenueTrendChart(filteredTransactions, $uiTheme),
      productPerformanceChart: buildHorizontalBarChart(
        filteredProducts,
        'Product revenue',
        ['rgba(255, 127, 169, 0.86)', 'rgba(110, 221, 247, 0.84)', 'rgba(194, 157, 253, 0.82)', 'rgba(134, 239, 172, 0.82)', 'rgba(250, 204, 148, 0.84)'],
        'rgba(255, 127, 169, 0.86)',
        $uiTheme
      ),
      staffPerformanceChart: buildHorizontalBarChart(
        filteredStaff,
        'Staff revenue',
        ['rgba(134, 239, 172, 0.86)', 'rgba(110, 221, 247, 0.84)', 'rgba(194, 157, 253, 0.82)', 'rgba(255, 127, 169, 0.8)', 'rgba(250, 204, 148, 0.82)'],
        'rgba(134, 239, 172, 0.86)',
        $uiTheme
      ),
      noResultsMessage
    };
  }
);

export function setDashboardProductFilter(value) {
  dashboardProductFilter.set(value || 'all');
}

export function setDashboardStaffFilter(value) {
  dashboardStaffFilter.set(value || 'all');
}

export function clearDashboardFilters() {
  dashboardProductFilter.set('all');
  dashboardStaffFilter.set('all');
}
