import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  // ES6 Destructuring and Array Closures for dynamic totals
  const subtotal = cart.reduce((accum, { price, quantity }) => {
    return accum + (Number(price) * Number(quantity));
  }, 0);

  const taxAmount = subtotal * 0.08;
  const shippingFee = subtotal > 150 || subtotal === 0 ? 0.00 : 10.00;
  const grandTotal = subtotal + taxAmount + shippingFee;

  const totalItemsCount = cart.reduce((count, { quantity }) => count + quantity, 0);

  return (
    <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} className="gradient-text" />
            <span>Active Shopping Cart</span>
            <span className="cart-badge" style={{ marginLeft: '0.25rem' }}>{totalItemsCount}</span>
          </div>
          <button id="close-cart-drawer-btn" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3>Your cart is empty</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Browse our store catalog and add your favorite items!
              </p>
            </div>
          ) : (
            cart.map(({ product_id, name, price, quantity, image_url, stock_quantity }) => {
              const itemTotal = Number(price) * quantity;
              return (
                <div key={product_id} className="cart-item" id={`cart-item-${product_id}`}>
                  <img src={image_url} alt={name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{name}</h4>
                    <div className="cart-item-price">${Number(price).toFixed(2)}</div>
                    
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(product_id, quantity - 1)}
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-val">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(product_id, Math.min(stock_quantity, quantity + 1))}
                        disabled={quantity >= stock_quantity}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                      ${itemTotal.toFixed(2)}
                    </div>
                    <button
                      className="close-btn"
                      style={{ color: 'var(--danger)', marginTop: '0.4rem' }}
                      onClick={() => onRemoveItem(product_id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (8%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={14} />
                Shipping
              </span>
              <span>{shippingFee === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
            </div>

            {subtotal > 0 && subtotal <= 150 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                💡 Add ${(150 - subtotal).toFixed(2)} more for FREE shipping!
              </div>
            )}

            <div className="summary-row total">
              <span>Grand Total</span>
              <span className="gradient-text">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              id="proceed-checkout-btn"
              className="checkout-btn"
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
