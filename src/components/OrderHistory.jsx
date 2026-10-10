import React, { useEffect, useState } from 'react';
import { fetchOrders, fetchInvoice } from '../services/api';
import { Receipt, FileText, Calendar, User, ArrowUpRight, RefreshCw } from 'lucide-react';

export default function OrderHistory({ onViewInvoice }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenInvoice = async (orderId) => {
    try {
      const invoiceData = await fetchInvoice(orderId);
      onViewInvoice(invoiceData);
    } catch (err) {
      alert('Could not fetch invoice details: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <RefreshCw size={32} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h3>Loading Order History...</h3>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Receipt size={22} color="#6366f1" />
          <h2 style={{ fontSize: '1.25rem' }}>Customer Order Records</h2>
        </div>
        <button className="nav-tab-btn" onClick={loadOrders} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart">
          <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            No past customer transactions recorded yet.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer Details</th>
                <th>Order Date</th>
                <th>Total Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      #{order.order_number}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{order.customer_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customer_email}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td>{order.total_items || 1} items</td>
                  <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td>
                    <span className="status-tag status-completed">
                      {order.order_status || 'COMPLETED'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      id={`view-invoice-btn-${order.order_id}`}
                      className="add-cart-btn"
                      onClick={() => handleOpenInvoice(order.order_id)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginLeft: 'auto' }}
                    >
                      <span>Invoice</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
