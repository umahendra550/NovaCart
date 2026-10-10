import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderInvoiceModal from './components/OrderInvoiceModal';
import BillingReports from './components/BillingReports';
import OrderHistory from './components/OrderHistory';
import NotificationToast from './components/NotificationToast';
import { fetchCategories, fetchProducts, submitOrder } from './services/api';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'reports', 'history'
  
  // Catalog Data State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Cart State (stored in React component state + localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('novacart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Controls & Status
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('novacart_cart', JSON.stringify(cart));
  }, [cart]);

  // Load Categories on mount
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch Products based on selected Category, Search Query, and Sort Order
  useEffect(() => {
    setIsLoadingProducts(true);
    const handler = setTimeout(() => {
      fetchProducts(activeCategory, searchQuery, sortOption)
        .then((data) => {
          setProducts(data);
          setIsLoadingProducts(false);
        })
        .catch((err) => {
          console.error('Error loading products:', err);
          setIsLoadingProducts(false);
        });
    }, 200);

    return () => clearTimeout(handler);
  }, [activeCategory, searchQuery, sortOption]);

  // ES6 Array Closure for total cart count calculation
  const totalCartCount = cart.reduce((count, { quantity }) => count + quantity, 0);

  // Cart Management Handlers
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product_id === product.product_id);
      if (existing) {
        showToast(`Updated "${product.name}" quantity in cart.`);
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: Math.min(product.stock_quantity, item.quantity + 1) }
            : item
        );
      } else {
        showToast(`Added "${product.name}" to cart!`);
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
    showToast('Item removed from cart.', 'error');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Submit Order Handler (POST /api/orders)
  const handleSubmitOrder = async (orderPayload) => {
    setIsSubmittingOrder(true);
    try {
      const response = await submitOrder(orderPayload);
      if (response.success && response.order) {
        setCart([]); // Clear cart upon successful transaction
        setIsCheckoutOpen(false);
        setActiveInvoice(response.order); // Display Order Invoice Modal
        showToast('🎉 Order placed successfully! Invoice generated.', 'success');
        
        // Refresh products catalog to reflect updated stock levels
        fetchProducts(activeCategory, searchQuery, sortOption).then(setProducts);
      }
    } catch (err) {
      showToast(err.message || 'Order submission failed.', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header Navbar Component */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Router */}
      <main>
        {activeTab === 'catalog' && (
          <>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              sortOption={sortOption}
              onSelectSort={setSortOption}
              totalProductsCount={products.length}
            />

            <ProductCatalog
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              isLoading={isLoadingProducts}
            />
          </>
        )}

        {activeTab === 'reports' && <BillingReports />}

        {activeTab === 'history' && (
          <OrderHistory onViewInvoice={(inv) => setActiveInvoice(inv)} />
        )}
      </main>

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmittingOrder}
      />

      {/* Retail Order Invoice Printable Modal */}
      <OrderInvoiceModal
        invoice={activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />

      {/* Toast Notification Alert */}
      <NotificationToast toast={toast} />
    </div>
  );
}
