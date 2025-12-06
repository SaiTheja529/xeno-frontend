const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  if (!response.ok) {
    const message = data?.message || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  summary: (token) => request('/metrics/summary', { token }),
  ordersByDate: (token) => request('/metrics/orders-by-date', { token }),
  topCustomers: (token) => request('/metrics/top-customers', { token }),
  seedSampleData: (token) => request('/dev/seed-sample-data', { token }),
  connectShopify: (token, payload) =>
    request('/shopify/connect', { method: 'POST', body: payload, token }),
  syncShopify: (token) => request('/shopify/sync', { method: 'POST', token }),
};
