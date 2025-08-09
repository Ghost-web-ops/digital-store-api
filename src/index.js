import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js'; 
import checkoutRoutes from './routes/checkout.routes.js';
import ordersRoutes from './routes/orders.routes.js'; // Importing orders routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', ordersRoutes); // Using orders routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});