import React from 'react';
import { X, Printer, CheckCircle, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function OrderInvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    subtotal,
    tax_amount,
    shipping_fee,
    total_amount,
    payment_method,
    order_status,
    created_at,
    items = []
  } = invoice;

  const formattedDate = created_at ? new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle size={22} color="#10b981" />
            <h2 style={{ fontSize: '1.2rem' }}>Order Confirmation & Invoice</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              id="print-invoice-btn"
              className="nav-tab-btn active"
              onClick={handlePrint}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
            <button id="close-invoice-modal-btn" className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Printable Invoice Container */}
          <div className="printable-area invoice-card" id="printable-invoice">
            {/* Invoice Top Bar */}
            <div className="invoice-header">
              <div>
                <div className="invoice-brand">NovaCart Store</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Retail Order & Billing Receipt
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  100 Innovation Way, Tech Park, CA 94025
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#1e293b' }}>INVOICE</h3>
                <div style={{ fontWeight: '700', color: '#4f46e5', fontSize: '1rem', margin: '0.25rem 0' }}>
                  #{order_number}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formattedDate}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="status-tag status-completed">{order_status || 'COMPLETED'}</span>
                </div>
              </div>
            </div>

            {/* Billed To & Payment Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px' }}>
              <div>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Billed & Shipped To:
                </h4>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{customer_name}</div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{customer_email}</div>
                {customer_phone && <div style={{ fontSize: '0.85rem', color: '#475569' }}>{customer_phone}</div>}
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem', whiteSpace: 'pre-line' }}>{shipping_address}</div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Payment Method:
                </h4>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{payment_method || 'Credit Card'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Status: Fully Authorized & Settled</div>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Product Description</th>
                  <th style={{ textAlign: 'center' }}>Unit Price</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {item.name || item.product_name}
                      </div>
                      {item.sku && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SKU: {item.sku}</div>}
                    </td>
                    <td style={{ textAlign: 'center', color: '#334155' }}>
                      ${Number(item.unit_price).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}>
                      {item.quantity}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                      ${Number(item.subtotal_price || (item.unit_price * item.quantity)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Calculation Box */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', color: '#475569', fontSize: '0.9rem' }}>
                  <span>Subtotal:</span>
                  <span>${Number(subtotal).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', color: '#475569', fontSize: '0.9rem' }}>
                  <span>Sales Tax (8%):</span>
                  <span>${Number(tax_amount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', color: '#475569', fontSize: '0.9rem' }}>
                  <span>Shipping Fee:</span>
                  <span>{Number(shipping_fee) === 0 ? 'FREE' : `$${Number(shipping_fee).toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0 0', borderTop: '2px solid #e2e8f0', fontSize: '1.15rem', fontWeight: '800', color: '#1e293b' }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: '#4f46e5' }}>${Number(total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Footer */}
            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
              Thank you for shopping with NovaCart Retail! For billing inquiries, contact billing@novacart.com.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
