const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articles');

require('dotenv').config();

const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,               // if you use cookies
}));
// Middleware
app.use(express.json())
app.use(cookieParser());;
app.use(express.urlencoded({ extended: true }));
app.use('/api/articles', articleRoutes);


mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log(' MongoDB connected');
    console.log(' Using database:', mongoose.connection.db.databaseName);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(' Collections in this database:');
    collections.forEach(col => console.log(`- ${col.name}`));

    const articles = await mongoose.connection.db
      .collection('articles')
      .find({})
      .limit(5) 
      .toArray();

    console.log('📰 Sample articles:', articles);
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));


// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

module.exports = app; //