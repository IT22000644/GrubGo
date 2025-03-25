import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import driverRoutes from './routes/dummy.driver.routes.js';
import restaurantRoutes from './routes/dummy.restaurant.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/drivers', driverRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/deliveries', deliveryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
