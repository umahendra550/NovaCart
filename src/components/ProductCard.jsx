import React from 'react';
import { Star, Plus, Check } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, isInCart }) {
  const {
    product_id,
    name,
    category_name,
    description,
    price,
    stock_quantity,
    image_url,
    rating,
    is_featured
  } = product;

  // Format currency formatted to 2 decimals
  const formattedPrice = `$${Number(price).toFixed(2)}`;
  const isOutOfStock = stock_quantity <= 0;

  return (
    <div className="product-card glass-panel" id={`product-card-${product_id}`}>
      <div className="product-image-wrap">
        <img
          src={image_url}
          alt={name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {Boolean(is_featured) && (
          <span className="featured-badge">Featured</span>
        )}
        <span className="rating-badge">
          <Star size={12} fill="#fbbf24" color="#fbbf24" />
          <span>{Number(rating).toFixed(1)}</span>
        </span>
      </div>

      <div className="product-body">
        <span className="product-category">{category_name}</span>
        <h3 className="product-title" title={name}>{name}</h3>
        <p className="product-desc">{description}</p>

        <div className="product-footer">
          <div>
            <div className="product-price">{formattedPrice}</div>
            <div style={{ fontSize: '0.75rem', color: isOutOfStock ? 'var(--danger)' : 'var(--text-muted)' }}>
              {isOutOfStock ? 'Out of Stock' : `Stock: ${stock_quantity} units`}
            </div>
          </div>

          <button
            id={`add-to-cart-btn-${product_id}`}
            className="add-cart-btn"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
          >
            {isInCart ? <Check size={16} color="#10b981" /> : <Plus size={16} />}
            <span>{isInCart ? 'In Cart' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
