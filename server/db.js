import mysql from 'mysql2/promise';

let dbType = 'memory'; 
let mysqlPool = null;
let sqliteDb = null;

// Initial seed dataset for in-memory / SQLite initialization
const initialCategories = [
  { category_id: 1, name: 'Electronics', slug: 'electronics', description: 'Cutting-edge gadgets, audio, and personal devices', icon: 'Cpu' },
  { category_id: 2, name: 'Home & Living', slug: 'home-living', description: 'Modern home appliances, kitchenware, and decor', icon: 'Home' },
  { category_id: 3, name: 'Fashion & Apparel', slug: 'fashion', description: 'Stylish streetwear, outerwear, and accessories', icon: 'Shirt' },
  { category_id: 4, name: 'Books & Accessories', slug: 'books', description: 'Bestselling paperbacks, journals, and stationery', icon: 'Book' }
];

const initialProducts = [
  { product_id: 1, category_id: 1, name: 'Pro Wireless ANC Headphones', sku: 'TECH-ANC-001', description: 'Active noise canceling headphones with 40-hour battery life and deep bass response.', price: 199.99, stock_quantity: 45, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', rating: 4.8, is_featured: 1 },
  { product_id: 2, category_id: 1, name: 'UltraSlim Smartwatch Series X', sku: 'TECH-WTC-002', description: 'Vibrant AMOLED screen, heart rate tracking, standalone GPS, and 50m water resistance.', price: 249.50, stock_quantity: 30, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', rating: 4.7, is_featured: 1 },
  { product_id: 3, category_id: 1, name: 'Mechanical Gaming Keyboard RGB', sku: 'TECH-KEY-003', description: 'Tactile mechanical switches with customizable per-key RGB backlighting and wrist rest.', price: 119.00, stock_quantity: 60, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', rating: 4.6, is_featured: 0 },
  { product_id: 4, category_id: 1, name: 'Precision Wireless Ergonomic Mouse', sku: 'TECH-MSE-004', description: 'High-precision 16,000 DPI sensor with ergonomic side grip and multi-device connection.', price: 69.99, stock_quantity: 85, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', rating: 4.5, is_featured: 0 },

  { product_id: 5, category_id: 2, name: 'Artisan Espresso Coffee Machine', sku: 'HOME-ESP-101', description: '15-bar Italian pump espresso machine with integrated steam milk frother wand.', price: 320.00, stock_quantity: 20, image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80', rating: 4.9, is_featured: 1 },
  { product_id: 6, category_id: 2, name: 'Minimalist Ceramic Vase Set', sku: 'HOME-VSE-102', description: 'Handcrafted Nordic matte ceramic vases ideal for modern minimalist living rooms.', price: 45.00, stock_quantity: 50, image_url: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600&q=80', rating: 4.4, is_featured: 0 },
  { product_id: 7, category_id: 2, name: 'Smart Ambient LED Floor Lamp', sku: 'HOME-LMP-103', description: 'Dimmable color-changing LED floor lamp compatible with Alexa, Google, and Apple Home.', price: 89.99, stock_quantity: 40, image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80', rating: 4.6, is_featured: 1 },

  { product_id: 8, category_id: 3, name: 'Genuine Leather Travel Backpack', sku: 'FSHN-BAG-201', description: 'Water-resistant full-grain leather backpack with dedicated 15-inch padded laptop sleeve.', price: 149.99, stock_quantity: 25, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', rating: 4.8, is_featured: 1 },
  { product_id: 9, category_id: 3, name: 'Classic Polarized Sunglasses', sku: 'FSHN-SGL-202', description: 'UV400 protection with ultra-lightweight titanium frame and anti-glare polarized lenses.', price: 79.50, stock_quantity: 70, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80', rating: 4.5, is_featured: 0 },
  { product_id: 10, category_id: 3, name: 'Urban Denim Jacket', sku: 'FSHN-JCK-203', description: 'Premium washed cotton denim jacket with button closure and double reinforced stitching.', price: 95.00, stock_quantity: 35, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', rating: 4.7, is_featured: 0 },

  { product_id: 11, category_id: 4, name: 'Hardcover Designer Journal', sku: 'BOOK-JRN-301', description: '160 GSM thick acid-free paper journal with bookmark ribbons and gold foil edges.', price: 24.99, stock_quantity: 120, image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', rating: 4.9, is_featured: 0 },
  { product_id: 12, category_id: 4, name: 'Architectural Masterpieces', sku: 'BOOK-ARC-302', description: 'Coffee table visual guide featuring 100 iconic modern architectural achievements.', price: 59.99, stock_quantity: 18, image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', rating: 4.9, is_featured: 1 }
];

const initialOrders = [
  {
    order_id: 101,
    order_number: 'ORD-2026-8801',
    customer_name: 'Alexander Wright',
    customer_email: 'alex.wright@example.com',
    customer_phone: '+1 555-0192',
    shipping_address: '742 Evergreen Terrace, Springfield',
    subtotal: 449.49,
    tax_amount: 35.96,
    shipping_fee: 15.00,
    total_amount: 500.45,
    payment_method: 'Credit Card',
    order_status: 'COMPLETED',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    order_id: 102,
    order_number: 'ORD-2026-8802',
    customer_name: 'Sophia Martinez',
    customer_email: 'sophia.m@example.com',
    customer_phone: '+1 555-0183',
    shipping_address: '100 Sunset Blvd, Los Angeles, CA',
    subtotal: 365.00,
    tax_amount: 29.20,
    shipping_fee: 0.00,
    total_amount: 394.20,
    payment_method: 'PayPal',
    order_status: 'COMPLETED',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

const initialOrderItems = [
  { item_id: 1, order_id: 101, product_id: 1, quantity: 1, unit_price: 199.99, subtotal_price: 199.99 },
  { item_id: 2, order_id: 101, product_id: 2, quantity: 1, unit_price: 249.50, subtotal_price: 249.50 },
  { item_id: 3, order_id: 102, product_id: 5, quantity: 1, unit_price: 320.00, subtotal_price: 320.00 },
  { item_id: 4, order_id: 102, product_id: 6, quantity: 1, unit_price: 45.00, subtotal_price: 45.00 }
];

// Persistent state for memory mode
let categoriesStore = JSON.parse(JSON.stringify(initialCategories));
let productsStore = JSON.parse(JSON.stringify(initialProducts));
let ordersStore = JSON.parse(JSON.stringify(initialOrders));
let orderItemsStore = JSON.parse(JSON.stringify(initialOrderItems));

let nextOrderId = 103;
let nextOrderItemId = 5;

export async function initDatabase() {
  const useMySQL = process.env.DB_HOST && process.env.DB_USER;

  if (useMySQL) {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ecommerce_db',
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      await mysqlPool.query('SELECT 1');
      dbType = 'mysql';
      return;
    } catch (err) {
      console.warn('MySQL Connection failed:', err.message);
    }
  }

  // Attempt SQLite dynamically if available natively
  try {
    const sqlite3Module = await import('sqlite3');
    const sqlite3 = sqlite3Module.default || sqlite3Module;
    await new Promise((resolve, reject) => {
      sqliteDb = new sqlite3.Database(':memory:', async (err) => {
        if (err) return reject(err);
        dbType = 'sqlite';
        try {
          await runSqlite(`
            CREATE TABLE categories (
              category_id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT UNIQUE NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              description TEXT,
              icon TEXT DEFAULT 'package',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
          `);
          
          await runSqlite(`
            CREATE TABLE products (
              product_id INTEGER PRIMARY KEY AUTOINCREMENT,
              category_id INTEGER NOT NULL,
              name TEXT NOT NULL,
              sku TEXT UNIQUE NOT NULL,
              description TEXT,
              price REAL NOT NULL,
              stock_quantity INTEGER NOT NULL DEFAULT 0,
              image_url TEXT,
              rating REAL DEFAULT 4.5,
              is_featured INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (category_id) REFERENCES categories(category_id)
            );
          `);

          await runSqlite(`
            CREATE TABLE orders (
              order_id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_number TEXT UNIQUE NOT NULL,
              customer_name TEXT NOT NULL,
              customer_email TEXT NOT NULL,
              customer_phone TEXT,
              shipping_address TEXT NOT NULL,
              subtotal REAL NOT NULL DEFAULT 0.0,
              tax_amount REAL NOT NULL DEFAULT 0.0,
              shipping_fee REAL NOT NULL DEFAULT 0.0,
              total_amount REAL NOT NULL DEFAULT 0.0,
              payment_method TEXT DEFAULT 'Credit Card',
              order_status TEXT DEFAULT 'COMPLETED',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
          `);

          await runSqlite(`
            CREATE TABLE order_items (
              item_id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_id INTEGER NOT NULL,
              product_id INTEGER NOT NULL,
              quantity INTEGER NOT NULL,
              unit_price REAL NOT NULL,
              subtotal_price REAL NOT NULL,
              FOREIGN KEY (order_id) REFERENCES orders(order_id),
              FOREIGN KEY (product_id) REFERENCES products(product_id)
            );
          `);

          for (const cat of initialCategories) {
            await runSqlite(`INSERT INTO categories (category_id, name, slug, description, icon) VALUES (?, ?, ?, ?, ?)`, [cat.category_id, cat.name, cat.slug, cat.description, cat.icon]);
          }
          for (const p of initialProducts) {
            await runSqlite(`INSERT INTO products (product_id, category_id, name, sku, description, price, stock_quantity, image_url, rating, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [p.product_id, p.category_id, p.name, p.sku, p.description, p.price, p.stock_quantity, p.image_url, p.rating, p.is_featured]);
          }
          for (const o of initialOrders) {
            await runSqlite(`INSERT INTO orders (order_id, order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal, tax_amount, shipping_fee, total_amount, payment_method, order_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [o.order_id, o.order_number, o.customer_name, o.customer_email, o.customer_phone, o.shipping_address, o.subtotal, o.tax_amount, o.shipping_fee, o.total_amount, o.payment_method, o.order_status, o.created_at]);
          }
          for (const oi of initialOrderItems) {
            await runSqlite(`INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price, subtotal_price) VALUES (?, ?, ?, ?, ?, ?)`, [oi.item_id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal_price]);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  } catch (err) {
    // Native SQLite module not available (e.g. Serverless environment) - fall back to pure JS memory engine
    dbType = 'memory';
  }
}

function runSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export async function query(sql, params = []) {
  if (dbType === 'mysql') {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
  } else if (dbType === 'sqlite') {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  } else {
    // Pure JS Memory Database Engine
    if (sql.includes('FROM categories')) {
      return categoriesStore.map(c => ({
        ...c,
        product_count: productsStore.filter(p => p.category_id === c.category_id).length
      }));
    }

    if (sql.includes('WHERE p.product_id = ?')) {
      const pId = Number(params[0]);
      const p = productsStore.find(x => x.product_id === pId);
      if (!p) return [];
      const cat = categoriesStore.find(c => c.category_id === p.category_id);
      return [{ ...p, category_name: cat ? cat.name : 'General' }];
    }

    if (sql.includes('FROM products')) {
      let list = productsStore.map(p => {
        const cat = categoriesStore.find(c => c.category_id === p.category_id);
        return { ...p, category_name: cat ? cat.name : 'General' };
      });

      if (params.length > 0 && sql.includes('p.category_id = ?')) {
        const catId = Number(params[0]);
        list = list.filter(p => p.category_id === catId);
      }

      if (params.some(p => typeof p === 'string' && p.startsWith('%'))) {
        const rawTerm = params.find(p => typeof p === 'string' && p.startsWith('%')) || '';
        const searchTerm = rawTerm.replace(/%/g, '').toLowerCase();
        if (searchTerm) {
          list = list.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm) ||
            p.sku.toLowerCase().includes(searchTerm)
          );
        }
      }

      if (sql.includes('ORDER BY p.price ASC')) {
        list.sort((a, b) => a.price - b.price);
      } else if (sql.includes('ORDER BY p.price DESC')) {
        list.sort((a, b) => b.price - a.price);
      } else if (sql.includes('ORDER BY p.rating DESC')) {
        list.sort((a, b) => b.rating - a.rating);
      } else {
        list.sort((a, b) => b.is_featured - a.is_featured || a.product_id - b.product_id);
      }

      return list;
    }

    if (sql.includes('FROM orders') && sql.includes('COUNT(oi.item_id)')) {
      return ordersStore.map(o => ({
        ...o,
        total_items: orderItemsStore.filter(oi => oi.order_id === o.order_id).length
      }));
    }

    if (sql.includes('FROM orders WHERE order_id = ? OR order_number = ?')) {
      const oId = params[0];
      return ordersStore.filter(o => o.order_id == oId || o.order_number == oId);
    }

    if (sql.includes('FROM order_items')) {
      const oId = Number(params[0]);
      const items = orderItemsStore.filter(oi => oi.order_id === oId);
      return items.map(oi => {
        const p = productsStore.find(x => x.product_id === oi.product_id);
        return {
          ...oi,
          product_name: p ? p.name : 'Product',
          sku: p ? p.sku : 'SKU',
          image_url: p ? p.image_url : ''
        };
      });
    }

    if (sql.includes('gross_category_revenue')) {
      return categoriesStore.map(c => {
        const catProducts = productsStore.filter(p => p.category_id === c.category_id);
        const catPIds = catProducts.map(p => p.product_id);
        const catItems = orderItemsStore.filter(oi => catPIds.includes(oi.product_id));
        const total_units_sold = catItems.reduce((acc, i) => acc + i.quantity, 0);
        const gross_category_revenue = catItems.reduce((acc, i) => acc + i.subtotal_price, 0);
        const uniqueOrders = new Set(catItems.map(i => i.order_id)).size;
        return {
          category_id: c.category_id,
          category_name: c.name,
          icon: c.icon,
          total_orders: uniqueOrders,
          total_units_sold,
          gross_category_revenue,
          average_unit_price: catProducts.length > 0 ? (catProducts.reduce((a, b) => a + b.price, 0) / catProducts.length) : 0
        };
      });
    }

    if (sql.includes('total_orders_placed')) {
      const gross_sales = ordersStore.reduce((a, b) => a + b.subtotal, 0);
      const total_tax_collected = ordersStore.reduce((a, b) => a + b.tax_amount, 0);
      const total_shipping_revenue = ordersStore.reduce((a, b) => a + b.shipping_fee, 0);
      const total_net_revenue = ordersStore.reduce((a, b) => a + b.total_amount, 0);
      return [{
        total_orders_placed: ordersStore.length,
        gross_sales,
        total_tax_collected,
        total_shipping_revenue,
        total_net_revenue,
        average_order_value: ordersStore.length > 0 ? total_net_revenue / ordersStore.length : 0
      }];
    }

    if (sql.includes('total_revenue_generated')) {
      return productsStore.map(p => {
        const cat = categoriesStore.find(c => c.category_id === p.category_id);
        const items = orderItemsStore.filter(oi => oi.product_id === p.product_id);
        const total_quantity_sold = items.reduce((a, b) => a + b.quantity, 0);
        const total_revenue_generated = items.reduce((a, b) => a + b.subtotal_price, 0);
        return {
          product_id: p.product_id,
          product_name: p.name,
          category_name: cat ? cat.name : 'General',
          total_quantity_sold,
          total_revenue_generated
        };
      }).sort((a, b) => b.total_revenue_generated - a.total_revenue_generated).slice(0, 5);
    }

    return [];
  }
}

export async function executeInsert(sql, params = []) {
  if (dbType === 'mysql') {
    const [result] = await mysqlPool.execute(sql, params);
    return result.insertId;
  } else if (dbType === 'sqlite') {
    const res = await runSqlite(sql, params);
    return res.lastID;
  } else {
    if (sql.includes('INSERT INTO orders')) {
      const newId = nextOrderId++;
      const newOrder = {
        order_id: newId,
        order_number: params[0],
        customer_name: params[1],
        customer_email: params[2],
        customer_phone: params[3],
        shipping_address: params[4],
        subtotal: params[5],
        tax_amount: params[6],
        shipping_fee: params[7],
        total_amount: params[8],
        payment_method: params[9],
        order_status: 'COMPLETED',
        created_at: new Date().toISOString()
      };
      ordersStore.push(newOrder);
      return newId;
    }

    if (sql.includes('INSERT INTO order_items')) {
      const newId = nextOrderItemId++;
      const item = {
        item_id: newId,
        order_id: params[0],
        product_id: params[1],
        quantity: params[2],
        unit_price: params[3],
        subtotal_price: params[4]
      };
      orderItemsStore.push(item);
      return newId;
    }
    return 1;
  }
}

export async function executeUpdate(sql, params = []) {
  if (dbType === 'mysql') {
    const [result] = await mysqlPool.execute(sql, params);
    return result.affectedRows;
  } else if (dbType === 'sqlite') {
    const res = await runSqlite(sql, params);
    return res.changes;
  } else {
    if (sql.includes('UPDATE products SET stock_quantity')) {
      const qty = params[0];
      const pId = params[1];
      const p = productsStore.find(x => x.product_id === pId);
      if (p) {
        p.stock_quantity = Math.max(0, p.stock_quantity - qty);
      }
      return 1;
    }
    return 1;
  }
}
