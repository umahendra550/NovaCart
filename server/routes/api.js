import express from 'express';
import { query, executeInsert, executeUpdate } from '../db.js';

const router = express.Router();

// Helper to generate readable order numbers
function generateOrderNumber() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-2026-${randomSuffix}`;
}

// ----------------------------------------------------------------------------
// 1. GET /api/categories - Fetch categories with product counts using GROUP BY
// ----------------------------------------------------------------------------
router.get('/categories', async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        c.category_id,
        c.name,
        c.slug,
        c.description,
        c.icon,
        COUNT(p.product_id) AS product_count
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      GROUP BY c.category_id, c.name, c.slug, c.description, c.icon
      ORDER BY c.category_id ASC;
    `;
    const categories = await query(sql);
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------
// 2. GET /api/products - Catalog browsing with category filter & search
// ----------------------------------------------------------------------------
router.get('/products', async (req, res, next) => {
  try {
    const { category_id, search, sort } = req.query;
    let sql = `
      SELECT 
        p.product_id,
        p.category_id,
        c.name AS category_name,
        p.name,
        p.sku,
        p.description,
        p.price,
        p.stock_quantity,
        p.image_url,
        p.rating,
        p.is_featured
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    if (category_id && category_id !== 'all') {
      sql += ` AND p.category_id = ?`;
      params.push(category_id);
    }

    if (search && search.trim() !== '') {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (sort === 'price-asc') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-desc') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sort === 'rating') {
      sql += ` ORDER BY p.rating DESC`;
    } else {
      sql += ` ORDER BY p.is_featured DESC, p.product_id ASC`;
    }

    const products = await query(sql, params);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------
// 3. GET /api/products/:id - Fetch single product details
// ----------------------------------------------------------------------------
router.get('/products/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const sql = `
      SELECT 
        p.*,
        c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    const products = await query(sql, [productId]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: products[0] });
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------
// 4. POST /api/orders - Process cart checkout and create Order + Order_Items
// ----------------------------------------------------------------------------
router.post('/orders', async (req, res, next) => {
  try {
    const { customer, items, paymentMethod = 'Credit Card' } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({ success: false, message: 'Customer details (name, email, address) are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart cannot be empty.' });
    }

    // Verify stock and compute subtotal using array closures
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productRows = await query('SELECT product_id, name, price, stock_quantity FROM products WHERE product_id = ?', [item.product_id]);
      
      if (productRows.length === 0) {
        return res.status(404).json({ success: false, message: `Product ID ${item.product_id} not found.` });
      }

      const dbProduct = productRows[0];
      const requestedQty = Number(item.quantity) || 1;

      if (dbProduct.stock_quantity < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock_quantity}, Requested: ${requestedQty}`
        });
      }

      const itemSubtotal = Number((dbProduct.price * requestedQty).toFixed(2));
      subtotal += itemSubtotal;

      verifiedItems.push({
        product_id: dbProduct.product_id,
        name: dbProduct.name,
        quantity: requestedQty,
        unit_price: dbProduct.price,
        subtotal_price: itemSubtotal
      });
    }

    // Tax calculation (8% tax rate)
    const taxAmount = Number((subtotal * 0.08).toFixed(2));
    // Flat shipping fee ($10), free shipping over $150
    const shippingFee = subtotal > 150 ? 0.00 : 10.00;
    const totalAmount = Number((subtotal + taxAmount + shippingFee).toFixed(2));
    const orderNumber = generateOrderNumber();

    // Insert into Orders table
    const orderSql = `
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone, shipping_address,
        subtotal, tax_amount, shipping_fee, total_amount, payment_method, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED')
    `;

    const orderParams = [
      orderNumber,
      customer.name,
      customer.email,
      customer.phone || '',
      customer.address,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
      paymentMethod
    ];

    const newOrderId = await executeInsert(orderSql, orderParams);

    // Insert into Order_Items and update Product stock
    for (const vItem of verifiedItems) {
      const itemSql = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal_price)
        VALUES (?, ?, ?, ?, ?)
      `;
      await executeInsert(itemSql, [newOrderId, vItem.product_id, vItem.quantity, vItem.unit_price, vItem.subtotal_price]);

      // Deduct stock
      const stockSql = `UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?`;
      await executeUpdate(stockSql, [vItem.quantity, vItem.product_id]);
    }

    // Build complete invoice response object
    const createdOrder = {
      order_id: newOrderId,
      order_number: orderNumber,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: customer.address,
      subtotal,
      tax_amount: taxAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      order_status: 'COMPLETED',
      created_at: new Date().toISOString(),
      items: verifiedItems
    };

    res.status(201).json({
      success: true,
      message: 'Order created and processed successfully!',
      order: createdOrder
    });

  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------
// 5. GET /api/orders - Fetch order history
// ----------------------------------------------------------------------------
router.get('/orders', async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        o.*,
        COUNT(oi.item_id) AS total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id
      ORDER BY o.order_id DESC;
    `;
    const orders = await query(sql);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------
// 6. GET /api/orders/:id/invoice - Generate invoice payload
// ----------------------------------------------------------------------------
router.get('/orders/:id/invoice', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const orderSql = `SELECT * FROM orders WHERE order_id = ? OR order_number = ?`;
    const orders = await query(orderSql, [orderId, orderId]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order invoice not found.' });
    }

    const order = orders[0];

    const itemsSql = `
      SELECT 
        oi.*,
        p.name AS product_name,
        p.sku,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `;
    const items = await query(itemsSql, [order.order_id]);

    const invoice = {
      ...order,
      items
    };

    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------
// 7. GET /api/reports/billing - Aggregate SQL Queries (SUM, COUNT, GROUP BY)
// ----------------------------------------------------------------------------
router.get('/reports/billing', async (req, res, next) => {
  try {
    // Aggregate Query 1: Revenue & Volume breakdown by Category
    const categoryQuery = `
      SELECT 
        c.category_id,
        c.name AS category_name,
        c.icon,
        COUNT(DISTINCT o.order_id) AS total_orders,
        COALESCE(SUM(oi.quantity), 0) AS total_units_sold,
        COALESCE(SUM(oi.subtotal_price), 0.00) AS gross_category_revenue,
        COALESCE(AVG(oi.unit_price), 0.00) AS average_unit_price
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id
      GROUP BY c.category_id, c.name, c.icon
      ORDER BY gross_category_revenue DESC;
    `;

    // Aggregate Query 2: Executive Financial Totals
    const summaryQuery = `
      SELECT 
        COUNT(order_id) AS total_orders_placed,
        COALESCE(SUM(subtotal), 0.00) AS gross_sales,
        COALESCE(SUM(tax_amount), 0.00) AS total_tax_collected,
        COALESCE(SUM(shipping_fee), 0.00) AS total_shipping_revenue,
        COALESCE(SUM(total_amount), 0.00) AS total_net_revenue,
        COALESCE(AVG(total_amount), 0.00) AS average_order_value
      FROM orders
      WHERE order_status = 'COMPLETED';
    `;

    // Aggregate Query 3: Top Selling Products
    const topProductsQuery = `
      SELECT 
        p.product_id,
        p.name AS product_name,
        c.name AS category_name,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity_sold,
        COALESCE(SUM(oi.subtotal_price), 0.00) AS total_revenue_generated
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      GROUP BY p.product_id, p.name, c.name
      ORDER BY total_revenue_generated DESC
      LIMIT 5;
    `;

    const categoryBreakdown = await query(categoryQuery);
    const executiveSummary = await query(summaryQuery);
    const topProducts = await query(topProductsQuery);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      report: {
        summary: executiveSummary[0] || {},
        categoryBreakdown,
        topProducts
      }
    });

  } catch (error) {
    next(error);
  }
});

export default router;
