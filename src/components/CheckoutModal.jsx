import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onSubmitOrder,
  isSubmitting
}) {
  const [formData, setFormData] = useState({
    name: 'Alexander Wright',
    email: 'alex.wright@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 100, Springfield, IL 62704',
    paymentMethod: 'Credit Card'
  });

  if (!isOpen) return null;

  // Closure calculation for totals
  const subtotal = cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 150 ? 0 : 10;
  const grandTotal = subtotal + tax + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitOrder({
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      },
      paymentMethod: formData.paymentMethod,
      items: cart
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="#6366f1" />
            <h2 style={{ fontSize: '1.25rem' }}>Secure Checkout & Invoice</h2>
          </div>
          <button id="close-checkout-modal-btn" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Customer Shipping Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="customer-name-input">Full Name *</label>
                <input
                  type="text"
                  id="customer-name-input"
                  name="name"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="customer-email-input">Email Address *</label>
                <input
                  type="email"
                  id="customer-email-input"
                  name="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="customer-phone-input">Phone Number</label>
                <input
                  type="tel"
                  id="customer-phone-input"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="payment-method-select">Payment Method</label>
                <select
                  id="payment-method-select"
                  name="paymentMethod"
                  className="form-input"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="PayPal">PayPal Instant</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer-address-input">Delivery Address *</label>
              <textarea
                id="customer-address-input"
                name="address"
                required
                rows={2}
                className="form-input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', margin: '1.5rem 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. Order Items Breakdown ({cart.length} unique line items)
            </h3>

            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
              {cart.map(({ product_id, name, price, quantity }) => (
                <div key={product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span>{name} <strong style={{ color: 'var(--accent-cyan)' }}>x{quantity}</strong></span>
                  <span style={{ fontWeight: '600' }}>${(price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700' }}>
                <span>Final Billing Amount</span>
                <span className="gradient-text">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              id="submit-order-btn"
              disabled={isSubmitting}
              className="checkout-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isSubmitting ? (
                <span>Processing Order & Database Transaction...</span>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  <span>Confirm & Generate Retail Invoice (${grandTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
