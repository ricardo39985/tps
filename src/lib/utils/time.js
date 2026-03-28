export function generateTransactionId() {
  return `TXN-${Date.now()}`;
}

export function getCurrentDateISO() {
  return new Date().toISOString().split('T')[0];
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
