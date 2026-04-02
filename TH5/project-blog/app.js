const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Kết nối DB
connectDB();

// Cấu hình
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Quan trọng để nhận style.css
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', postRoutes);

app.listen(3000, () => console.log('🚀 Server: http://localhost:3000'));