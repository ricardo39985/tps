export function generateTransactionId() {
  return `TXN-${Date.now()}`;
}

export function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getCurrentDateISO() {
  return new Date().toISOString().split('T')[0];
}

export function getDateISOYearsAgo(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Number(years || 0));
  return formatDateISO(date);
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

export function getLiveDateLabel(date = new Date()) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getLiveTimeLabel(date = new Date()) {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
