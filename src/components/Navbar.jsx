import React from 'react';
import { ShoppingBag, Search, BarChart3, Store, Receipt, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery
}) {
  return (
    <header className="navbar glass-panel">
      <div className="brand-logo" onClick={() => setActiveTab('catalog')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <ShoppingBag size={22} color="#ffffff" />
        </div>
        <div>
          <span>Nova</span>
          <span className="gradient-text">Cart</span>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="store-search-input"
            className="search-input"
            placeholder="Search electronics, home goods, apparel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="nav-links">
        <button
          id="nav-store-btn"
          className={`nav-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <Store size={18} />
          <span>Store Catalog</span>
        </button>

        <button
          id="nav-reports-btn"
          className={`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <BarChart3 size={18} />
          <span>Billing Reports</span>
        </button>

        <button
          id="nav-history-btn"
          className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Receipt size={18} />
          <span>Order History</span>
        </button>

        <button
          id="open-cart-drawer-btn"
          className="cart-trigger-btn"
          onClick={onOpenCart}
          title="View Cart"
        >
          <ShoppingBag size={18} />
          <span>Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
