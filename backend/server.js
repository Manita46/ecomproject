const cors = require('cors');
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();

const PORT = process.env.PORT || 5000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});
const db = pool.promise();

pool.getConnection((err) => {
    if (err) {
        console.log('Error connecting to MySQL database = ', err)
        return
    }
    console.log('MySQL successfully connected');
})

module.exports = db;

app.get('/', (req, res) => {
    res.send('Welcome to the Café Ordering System!');
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const orderitemRoutes = require('./routes/orderitem');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orderitem',orderitemRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
