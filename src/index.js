import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js'; 
import checkoutRoutes from './routes/checkout.routes.js';
import ordersRoutes from './routes/orders.routes.js'; // Importing orders routes
import './passport-setup.js'; // Importing passport setup for Google authentication
import passport from 'passport';
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', ordersRoutes); // Using orders routes

app.get('/', (req, res) => {
  res.send('Welcome to the Digital Store API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});