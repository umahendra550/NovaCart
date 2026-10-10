import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ----------------------------------------------------------------------------
// Integrated Database & Server Error Handling Middleware
// ----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('SERVER ERROR HANDLER ENCOUNTERED AN ERROR:', err.stack || err.message || err);

  // Database Constraint Violations (MySQL & SQLite)
  if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('UNIQUE constraint failed')) {
    return res.status(409).json({
      success: false,
      error_type: 'DATABASE_DUPLICATE_ERROR',
      message: 'A record with this identifier already exists.'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.message?.includes('FOREIGN KEY constraint failed')) {
    return res.status(400).json({
      success: false,
      error_type: 'DATABASE_FOREIGN_KEY_ERROR',
      message: 'Invalid relational reference: Category or Product ID does not exist.'
    });
  }

  // Fallback for general server/database errors
  res.status(err.status || 500).json({
    success: false,
    error_type: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred processing your request.'
  });
});

// Start DB then HTTP server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 E-Commerce Express Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints ready at http://localhost:${PORT}/api/products`);
      console.log(`=======================================================`);
    });
  })
  .catch((err) => {
    console.error('Fatal Database Initialization Error:', err);
    process.exit(1);
  });
