export function normalizeDashboardLabel(value) {
  const label = String(value ?? '').trim().replace(/\s+/g, ' ');
  return label || 'Unknown';
}

export function uniqueDashboardLabels(values = []) {
  const seen = new Map();

  values.forEach((value) => {
    const label = normalizeDashboardLabel(value);
    const key = label.toLowerCase();

    if (!seen.has(key)) {
      seen.set(key, label);
    }
  });

  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
