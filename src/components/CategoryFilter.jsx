import React from 'react';
import { LayoutGrid, Cpu, Home, Shirt, Book } from 'lucide-react';

const iconMap = {
  Cpu: Cpu,
  Home: Home,
  Shirt: Shirt,
  Book: Book
};

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  sortOption,
  onSelectSort,
  totalProductsCount
}) {
  return (
    <div className="category-filter-bar">
      <div className="category-pills">
        <button
          id="category-pill-all"
          className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <LayoutGrid size={16} />
          <span>All Items</span>
          <span className="category-count">{totalProductsCount}</span>
        </button>

        {categories.map(({ category_id, name, icon, product_count }) => {
          const IconComp = iconMap[icon] || LayoutGrid;
          return (
            <button
              key={category_id}
              id={`category-pill-${category_id}`}
              className={`category-pill ${activeCategory == category_id ? 'active' : ''}`}
              onClick={() => onSelectCategory(category_id)}
            >
              <IconComp size={16} />
              <span>{name}</span>
              <span className="category-count">{product_count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
        <select
          id="product-sort-select"
          className="sort-select"
          value={sortOption}
          onChange={(e) => onSelectSort(e.target.value)}
        >
          <option value="featured">Featured & Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
