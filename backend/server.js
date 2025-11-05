const cors = require('cors');
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',  
    password: '1234',
    database: 'mydb',
    port: '3306'
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
