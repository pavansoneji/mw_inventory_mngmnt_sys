import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import inventoryRoutes from './routes/inventory';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

// Test root
app.get('/', (req, res) => {
  res.json({ message: 'Inventory Management System API is running' });
});

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/inventoryDB';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
