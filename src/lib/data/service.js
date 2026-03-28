const API_URL = 'https://script.google.com/macros/s/AKfycbxihvruoxLX5TRdNprw6yeNjzb-cHP8lVHkuX9fdwJv90qD-2N-zswxZywvVwSiUIVeeg/exec';

function jsonpRequest(action, extraParams = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement('script');

    window[callbackName] = (data) => {
      resolve(data);
      cleanup();
    };

    function cleanup() {
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    script.onerror = () => {
      reject(new Error(`JSONP request failed for action: ${action}`));
      cleanup();
    };

    const params = new URLSearchParams({
      action,
      callback: callbackName,
      ...extraParams
    });

    script.src = `${API_URL}?${params.toString()}`;
    document.body.appendChild(script);
  });
}

export function getItems() {
  return jsonpRequest('getItems');
}

export function getStaff() {
  return jsonpRequest('getStaff');
}

export function getDashboardSummary() {
  return jsonpRequest('getDashboardSummary');
}

export function getTransactions() {
  return jsonpRequest('getTransactions');
}

export function searchTransactions(filters = {}) {
  const params = {};

  if (filters.query) params.query = filters.query;
  if (filters.date) params.date = filters.date;
  if (filters.staff_name) params.staff_name = filters.staff_name;

  return jsonpRequest('searchTransactions', params);
}

export async function postAction(payload) {
  return fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });
}
