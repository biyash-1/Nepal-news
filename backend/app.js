const express = require('express');
const fs = require('fs').promises;
const path = require('path');
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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

// Path to the JSON file
const NEWS_JSON_PATH = path.join(__dirname, 'data/news.json');

// Check and initialize JSON file
const initializeNewsJson = async () => {
  try {
    // Check if data directory exists
    const dataDir = path.join(__dirname, 'data');
    try {
      await fs.access(dataDir);
      console.log('✅ Data directory exists');
    } catch {
      console.log('📁 Creating data directory...');
      await fs.mkdir(dataDir, { recursive: true });
      console.log('✅ Data directory created');
    }

    // Check if news.json exists
    try {
      await fs.access(NEWS_JSON_PATH);
      console.log('✅ news.json file exists');
      
      // Read and validate the file
      const data = await fs.readFile(NEWS_JSON_PATH, 'utf-8');
      const articles = JSON.parse(data);
      
      console.log('📊 News.json Statistics:');
      console.log(`   - Total articles: ${articles.length}`);
      
      if (articles.length > 0) {
        console.log(`   - Sample article IDs: ${articles.slice(0, 5).map(a => a.id || a._id).join(', ')}`);
        console.log('   - First article:');
        console.log(`     * ID: ${articles[0].id || articles[0]._id}`);
        console.log(`     * Title: ${articles[0].title}`);
        console.log(`     * Categories: ${articles[0].categories?.join(', ') || 'None'}`);
      }
      
      // Check for categories
      const categories = [...new Set(articles.flatMap(a => a.categories || []))];
      console.log(`   - Unique categories: ${categories.join(', ') || 'None'}`);
      
      console.log('📰 Sample articles:', articles.slice(0, 5));
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📁 news.json not found, creating empty file...');
        await fs.writeFile(NEWS_JSON_PATH, JSON.stringify([], null, 2), 'utf-8');
        console.log('✅ Empty news.json created');
      } else {
        throw error;
      }
    }

    console.log('✅ JSON file system ready');
    console.log('📍 File location:', NEWS_JSON_PATH);
    
  } catch (error) {
    console.error('❌ JSON file initialization error:', error);
    throw error;
  }
};

// Initialize JSON file system (replaces MongoDB connection)
initializeNewsJson()
  .then(() => {
    console.log('🚀 Ready to serve articles from JSON file');
  })
  .catch(err => {
    console.error('❌ Failed to initialize JSON file system:', err);
  });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

module.exports = app;