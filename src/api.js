const defaultBase = import.meta.env.DEV ? 'http://localhost:8000' : '';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || defaultBase).replace(/\/$/, '');

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    if (response.status === 204) return null;
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'The request could not be completed.');
    return data;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) {
      throw new Error(
        'Calculation service is currently unavailable. Check your connection and try again.',
      );
    }
    if (error instanceof SyntaxError)
      throw new Error('The service returned an invalid response. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  calculate: (expression) =>
    request('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression }),
    }),
  history: (page, search) =>
    request(`/api/history?${new URLSearchParams({ page, page_size: 20, search })}`),
  delete: (id) => request(`/api/history/${id}`, { method: 'DELETE' }),
  clear: () => request('/api/history', { method: 'DELETE' }),
};
