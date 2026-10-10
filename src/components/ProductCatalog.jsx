import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

export default function ProductCatalog({
  products,
  cart,
  onAddToCart,
  isLoading
}) {
  if (isLoading) {
    return (
      <div className="products-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel" style={{ height: '360px', borderRadius: 'var(--radius-lg)', opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="glass-panel empty-cart" style={{ borderRadius: 'var(--radius-lg)' }}>
        <PackageSearch size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
        <h3>No Products Found</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
          We couldn't find any products matching your selected filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        // Use ES6 array closure (some) to check if item is in cart
        const isInCart = cart.some(({ product_id }) => product_id === product.product_id);
        return (
          <ProductCard
            key={product.product_id}
            product={product}
            onAddToCart={onAddToCart}
            isInCart={isInCart}
          />
        );
      })}
    </div>
  );
}
