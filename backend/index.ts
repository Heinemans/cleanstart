import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Allow cookies to be sent with requests
}));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Rental Management API' });
});

// Run database creation and seed script in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode detected, running initialization scripts...');
  
  // Import and run the database creation script
  import('./scripts/createDatabase')
    .then(createDbModule => {
      const createDatabase = createDbModule.default;
      return createDatabase();
    })
    .then(() => {
      console.log('Running seed script...');
      // Import and run the seed script
      return import('./scripts/seed')
        .then(seedModule => {
          const seedUser = seedModule.default;
          return seedUser();
        });
    })
    .catch(err => console.error('Error running initialization scripts:', err));
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 