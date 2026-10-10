# 🛒 NovaCart — Full-Stack E-Commerce & Order Management System

NovaCart is a full-stack, enterprise-grade E-Commerce web application featuring a modern React frontend, Express REST API backend, dual relational database engines (SQLite & MySQL), and serverless Vercel deployment support.

---

## 🌟 Key Features

- **🏬 Dynamic Product Catalog:** Browse products across categories (*Electronics, Home & Living, Fashion & Apparel, Books & Accessories*) with instant search and multi-criteria sorting (*Featured, Price Low to High, Price High to Low, Top Rated*).
- **🛍️ Reactive Shopping Cart:** Slide-out interactive cart drawer with live subtotal calculations, automatically applied 8% sales tax, conditional free shipping, and quantity controls.
- **📄 Instant Checkout & Invoice Generator:** Complete checkout form with stock verification, real-time database validation, order creation, and automated invoice PDF/HTML preview.
- **📜 Order History Tracker:** View past customer orders with order IDs, status badges, timestamping, customer shipping information, and item breakdowns.
- **📊 Executive Billing & Financial Analytics:** Comprehensive analytics dashboard displaying total revenue, gross sales, tax collected, category revenue distribution (SQL `GROUP BY` & `SUM`), and top 5 best-selling products.
- **🎨 Glassmorphic Premium UI:** Dark mode visual layout with CSS HSL color tokens, micro-interactions, responsive grids, and smooth animations.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite 5](https://vitejs.dev/)
- **Styling:** Custom Vanilla CSS Design System with Glassmorphism, HSL Tokens & Keyframe Animations
- **Icons:** [Lucide React](https://lucide.dev/)

### **Backend**
- **Runtime:** [Node.js](https://nodejs.org/)
- **Web Framework:** [Express 4](https://expressjs.com/)
- **Middleware:** CORS, Express JSON Body Parser
- **Serverless API Router:** Vercel Edge Serverless Function handlers (`/api/index.js`)

### **Database Engine**
- **Primary / Demo Mode:** In-Memory SQLite Engine (`sqlite3`) with dynamic schema creation and automated seeding.
- **Production Mode:** MySQL Relational Database (`mysql2`) with connection pooling.
- **Serverless Fallback:** Pure JS In-Memory Relational Engine for Vercel/Cloud Lambda environments.

---

## 📂 Project Structure

```
NovaCart/
├── api/
│   └── index.js              # Vercel serverless Express API entry point
├── database/
│   └── schema.sql            # MySQL / Relational Database Schema definition
├── server/
│   ├── db.js                 # Unified Database Connection & Seeding Engine
│   ├── index.js              # Express Server entry point (Port 5000)
│   └── routes/
│       └── api.js            # Express API Routes & SQL Handlers
├── src/
│   ├── components/
│   │   ├── BillingReports.jsx # Financial Analytics & Aggregate Charts
│   │   ├── CartDrawer.jsx     # Slide-out Cart & Checkout Modal
│   │   ├── CategoryFilter.jsx # Category Pills & Search Controls
│   │   ├── InvoiceModal.jsx   # Order Printable Invoice Modal
│   │   ├── NotificationToast.jsx # Floating Toast System
│   │   ├── OrderHistory.jsx   # Past Orders Table View
│   │   └── ProductCard.jsx    # Individual Product Item Card
│   ├── services/
│   │   └── api.js            # Frontend HTTP API Client
│   ├── App.jsx               # Primary Application Container
│   ├── main.jsx              # React Entry Point
│   └── index.css             # Design Tokens, Glassmorphism & Layouts
├── index.html                # HTML5 Shell
├── package.json              # Dependencies & Scripts
├── vercel.json               # Vercel Route Rewrites Configuration
└── vite.config.js            # Vite Dev Server & Proxy Settings
```

---

## 🗄️ Database Schema & Relational Structure

NovaCart utilizes four interconnected relational entities:

1. `categories` — Product categories (`category_id`, `name`, `slug`, `description`, `icon`)
2. `products` — Catalog items linked via `category_id` foreign key (`product_id`, `name`, `sku`, `price`, `stock_quantity`, `rating`, `is_featured`)
3. `orders` — Completed customer orders (`order_id`, `order_number`, `customer_name`, `customer_email`, `total_amount`, `order_status`)
4. `order_items` — Line items mapping orders to products (`item_id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal_price`)

---

## 🚀 Quick Start & Installation

### **Prerequisites**
Ensure you have **Node.js 18+** and **npm** installed on your system.

```bash
node -v
npm -v
```

### **1. Clone the Repository**
```bash
git clone https://github.com/umahendra550/NovaCart.git
cd NovaCart
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start the Development Application**

You can run both the Express backend and Vite frontend concurrently:

#### **Option A: Run Backend & Frontend separately**

**Terminal 1 (Backend Express Server):**
```bash
npm run server
```
*Server runs on:* `http://localhost:5000`

**Terminal 2 (Frontend Vite Server):**
```bash
npm run dev
```
*Frontend runs on:* `http://localhost:3000`

---

## 📡 API Endpoints Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Fetch all product categories with product counts |
| `GET` | `/api/products` | Query catalog with optional `category_id`, `search`, `sort` params |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/orders` | Process cart checkout, verify stock, create order & line items |
| `GET` | `/api/orders` | Retrieve customer order history |
| `GET` | `/api/orders/:id/invoice` | Generate printable invoice payload for order |
| `GET` | `/api/reports/billing` | Executive analytics (Revenue by category, gross totals, top products) |

---

## ☁️ Deployment (Vercel)

NovaCart is configured for seamless single-command deployment to Vercel:

```bash
npx vercel
```

Vercel reads `vercel.json` and routes API requests (`/api/*`) to serverless function endpoints in `api/index.js`, while serving the compiled Vite React frontend globally on Vercel Edge Network.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
