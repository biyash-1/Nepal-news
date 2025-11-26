// models/Article.js
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
  categories: [{ 
    type: String 
  }],
  tags: [{ 
    type: String 
  }],
  author: {
    userId: { 
      type: String, 
      required: true 
    },
    username: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: String 
    }
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Add indexes for better query performance
ArticleSchema.index({ categories: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ 'author.userId': 1 });
ArticleSchema.index({ title: 'text', content: 'text' }); // For search functionality

module.exports = mongoose.model('Article', ArticleSchema);