import { API_URL } from '../constants/config';

export const COUNT_ENDPOINTS = {
  active: '/active-products',
  draft: '/draft-products',
  zeroInventory: '/zero-inventory',
  outOfStock: '/out-of-stocks',
};

export async function fetchCount(endpoint, signal) {
  const res = await fetch(`${API_URL}${endpoint}?limit=1`, { signal });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'API error');
  return json.data?.total ?? null;
}
