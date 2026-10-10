import express from 'express';
import cors from 'cors';
import { initDatabase } from '../server/db.js';
import apiRoutes from '../server/routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbInitialized = false;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
    } catch (err) {
      console.error('Database initialization note:', err);
    }
    dbInitialized = true;
  }
  next();
});

// Support both /api prefix and direct serverless route mapping
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

export default app;
