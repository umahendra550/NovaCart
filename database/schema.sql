-- ============================================================================
-- E-COMMERCE CART & ORDER MANAGEMENT SYSTEM
-- Database: MySQL
-- Tables: Categories, Products, Orders, Order_Items
-- Features: Foreign Key Constraints, Transactions, Aggregate SQL Reports
-- ============================================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'package',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 4.5,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30),
    shipping_address TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'Credit Card',
    order_status ENUM('PENDING', 'COMPLETED', 'SHIPPED', 'CANCELLED') DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal_price DECIMAL(10, 2) NOT NULL CHECK (subtotal_price >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

INSERT INTO categories (category_id, name, slug, description, icon) VALUES
(1, 'Electronics', 'electronics', 'Cutting-edge gadgets, audio, and personal devices', 'cpu'),
(2, 'Home & Living', 'home-living', 'Modern home appliances, kitchenware, and decor', 'home'),
(3, 'Fashion & Apparel', 'fashion', 'Stylish streetwear, outerwear, and accessories', 'shirt'),
(4, 'Books & Accessories', 'books', 'Bestselling paperbacks, journals, and stationery', 'book');

INSERT INTO products (product_id, category_id, name, sku, description, price, stock_quantity, image_url, rating, is_featured) VALUES
(1, 1, 'Pro Wireless ANC Headphones', 'TECH-ANC-001', 'Active noise canceling headphones with 40-hour battery life and deep bass.', 199.99, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 4.8, 1),
(2, 1, 'UltraSlim Smartwatch Series X', 'TECH-WTC-002', 'Vibrant AMOLED screen, heart rate tracking, GPS, and water resistance.', 249.50, 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', 4.7, 1),
(3, 1, 'Mechanical Gaming Keyboard RGB', 'TECH-KEY-003', 'Tactile mechanical switches with customizable per-key RGB backlighting.', 119.00, 60, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 4.6, 0),
(4, 1, 'Precision Wireless Ergonomic Mouse', 'TECH-MSE-004', 'High-precision sensor with ergonomic side grip and dual connectivity.', 69.99, 85, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', 4.5, 0),

(5, 2, 'Artisan Espresso Coffee Machine', 'HOME-ESP-101', '15-bar Italian pump espresso machine with integrated steam milk frother.', 320.00, 20, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80', 4.9, 1),
(6, 2, 'Minimalist Ceramic Vase Set', 'HOME-VSE-102', 'Handcrafted Nordic matte ceramic vases ideal for modern living rooms.', 45.00, 50, 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600&q=80', 4.4, 0),
(7, 2, 'Smart Ambient LED Floor Lamp', 'HOME-LMP-103', 'Dimmable color-changing LED floor lamp compatible with smart home apps.', 89.99, 40, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80', 4.6, 1),

(8, 3, 'Genuine Leather Travel Backpack', 'FSHN-BAG-201', 'Water-resistant full-grain leather backpack with dedicated 15-inch laptop sleeve.', 149.99, 25, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 4.8, 1),
(9, 3, 'Classic Polarized Sunglasses', 'FSHN-SGL-202', 'UV400 protection with lightweight titanium frame and polarized lenses.', 79.50, 70, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80', 4.5, 0),
(10, 3, 'Urban Bomber Denim Jacket', 'FSHN-JCK-203', 'Premium washed cotton denim jacket with reinforced double stitching.', 95.00, 35, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', 4.7, 0),

(11, 4, 'Hardcover Designer Hardbound Journal', 'BOOK-JRN-301', '160 GSM thick acid-free paper journal with gold foil page edges.', 24.99, 120, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 4.9, 0),
(12, 4, 'Architectural Masterpieces Hardcover', 'BOOK-ARC-302', 'Coffee table visual guide featuring 100 iconic modern architecture designs.', 59.99, 18, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', 4.9, 1);

-- Seed Initial Orders for Analytics
INSERT INTO orders (order_id, order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal, tax_amount, shipping_fee, total_amount, payment_method, order_status, created_at) VALUES
(101, 'ORD-2026-8801', 'Alexander Wright', 'alex.wright@example.com', '+1 555-0192', '742 Evergreen Terrace, Springfield', 449.49, 35.96, 15.00, 500.45, 'Credit Card', 'COMPLETED', NOW() - INTERVAL 5 DAY),
(102, 'ORD-2026-8802', 'Sophia Martinez', 'sophia.m@example.com', '+1 555-0183', '100 Sunset Blvd, Los Angeles, CA', 365.00, 29.20, 0.00, 394.20, 'PayPal', 'COMPLETED', NOW() - INTERVAL 3 DAY),
(103, 'ORD-2026-8803', 'Ethan Carter', 'ethan.c@example.com', '+1 555-0144', '42 Wallaby Way, Sydney', 229.49, 18.36, 10.00, 257.85, 'Credit Card', 'COMPLETED', NOW() - INTERVAL 1 DAY);

INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price, subtotal_price) VALUES
(1, 101, 1, 1, 199.99, 199.99),
(2, 101, 2, 1, 249.50, 249.50),
(3, 102, 5, 1, 320.00, 320.00),
(4, 102, 6, 1, 45.00, 45.00),
(5, 103, 8, 1, 149.99, 149.99),
(6, 103, 9, 1, 79.50, 79.50);


-- ============================================================================
-- DEMO AGGREGATE SQL QUERIES (SUM, COUNT, GROUP BY) FOR BILLING REPORTS
-- ============================================================================

-- Query 1: Sales Revenue and Item Volume Breakdown by Category
-- Demonstrates JOIN across 4 tables, SUM(), COUNT(), and GROUP BY
SELECT 
    c.category_id,
    c.name AS category_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.subtotal_price) AS gross_category_revenue,
    AVG(oi.unit_price) AS average_unit_price
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id
GROUP BY c.category_id, c.name
ORDER BY gross_category_revenue DESC;

-- Query 2: Executive Financial Summary Metrics
-- Demonstrates aggregate metrics calculation across all orders
SELECT 
    COUNT(order_id) AS total_orders_placed,
    SUM(subtotal) AS gross_sales,
    SUM(tax_amount) AS total_tax_collected,
    SUM(shipping_fee) AS total_shipping_revenue,
    SUM(total_amount) AS total_net_revenue,
    AVG(total_amount) AS average_order_value
FROM orders
WHERE order_status = 'COMPLETED';

-- Query 3: Top Selling Products Billing Report
-- Ranks products by revenue generated using SUM and GROUP BY
SELECT 
    p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.subtotal_price) AS total_revenue_generated
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY p.product_id, p.name, c.name
ORDER BY total_revenue_generated DESC
LIMIT 5;
