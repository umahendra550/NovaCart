// Frontend REST API helper module connecting with Express backend
const API_BASE = '/api';

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load categories');
  return data.data;
}

export async function fetchProducts(categoryId = 'all', searchQuery = '', sortOption = 'featured') {
  const params = new URLSearchParams();
  if (categoryId !== 'all') params.append('category_id', categoryId);
  if (searchQuery) params.append('search', searchQuery);
  if (sortOption) params.append('sort', sortOption);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load products');
  return data.data;
}

export async function submitOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit order');
  return data;
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch order history');
  return data.data;
}

export async function fetchInvoice(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/invoice`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch invoice');
  return data.invoice;
}

export async function fetchBillingReports() {
  const res = await fetch(`${API_BASE}/reports/billing`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load billing report analytics');
  return data.report;
}
