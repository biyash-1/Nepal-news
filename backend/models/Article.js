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
  // Track recent views for trending calculation
  recentViews: [{
    timestamp: { type: Date, default: Date.now },
    // We'll clean up old entries periodically
  }],
  likes: {
    type: Number,
    default: 0
  },
  // Auto-managed trending status
  isTrending: {
    type: Boolean,
    default: false
  },
  lastTrendingCheck: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true
});

// Add indexes for better query performance
ArticleSchema.index({ categories: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ 'author.userId': 1 });
ArticleSchema.index({ title: 'text', content: 'text' });
ArticleSchema.index({ isTrending: -1, views: -1 }); // For trending queries

// Method to increment view count
ArticleSchema.methods.incrementView = async function() {
  this.views += 1;
  this.recentViews.push({ timestamp: new Date() });
  
  // Keep only last 7 days of view data to prevent array from growing too large
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  this.recentViews = this.recentViews.filter(v => v.timestamp > sevenDaysAgo);
  
  await this.save();
};

// Method to check and update trending status
ArticleSchema.methods.updateTrendingStatus = async function(config) {
  const now = new Date();
  
  // Get views in the configured time window
  const timeWindowMs = config.timeWindowHours * 60 * 60 * 1000;
  const windowStart = new Date(now - timeWindowMs);
  
  const recentViewCount = this.recentViews.filter(
    v => v.timestamp > windowStart
  ).length;
  
  // Check if article meets trending criteria
  const meetsRecentViews = recentViewCount >= config.minRecentViews;
  const meetsTotalViews = this.views >= config.minTotalViews;
  
  // Article is trending if it meets either criteria
  const shouldBeTrending = meetsRecentViews || meetsTotalViews;
  
  if (this.isTrending !== shouldBeTrending) {
    this.isTrending = shouldBeTrending;
    
    // Add or remove trending tag
    if (shouldBeTrending && !this.tags.includes('ट्रेन्डिङ')) {
      this.tags.push('ट्रेन्डिङ');
    } else if (!shouldBeTrending && this.tags.includes('ट्रेन्डिङ')) {
      this.tags = this.tags.filter(tag => tag !== 'ट्रेन्डिङ');
    }
    
    this.lastTrendingCheck = now;
    await this.save();
  }
  
  return this.isTrending;
};

module.exports = mongoose.model('Article', ArticleSchema);