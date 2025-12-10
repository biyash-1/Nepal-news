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
  // View tracking with rolling windows
  views: {
    type: Number,
    default: 0
  },
  viewsLast24h: {
    type: Number,
    default: 0,
    index: true
  },
  viewsLast7d: {
    type: Number,
    default: 0,
    index: true
  },
  // Precomputed scores for fast queries
  trendingScore: {
    type: Number,
    default: 0,
    index: true
  },
  popularScore: {
    type: Number,
    default: 0,
    index: true
  },
  likes: {
    type: Number,
    default: 0
  },
  // Metadata for score calculation
  lastScoreUpdate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true
});

// Indexes for better query performance
ArticleSchema.index({ categories: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ 'author.userId': 1 });
ArticleSchema.index({ title: 'text', content: 'text' });
ArticleSchema.index({ trendingScore: -1, createdAt: -1 }); // For trending queries
ArticleSchema.index({ popularScore: -1, createdAt: -1 }); // For popular queries
ArticleSchema.index({ views: -1 }); // For all-time popular

// Method to increment view count (called on each view)
ArticleSchema.methods.incrementView = async function() {
  this.views += 1;
  
  // Immediately increment rolling window counts
  // These will be periodically recalculated by cron for accuracy
  this.viewsLast24h += 1;
  this.viewsLast7d += 1;
  
  await this.save({ validateBeforeSave: false });
};

// Method to calculate trending score
// Formula: weighted combination of recent views, velocity, and recency boost
ArticleSchema.methods.calculateTrendingScore = function() {
  const now = Date.now();
  const articleAge = now - new Date(this.createdAt).getTime();
  const ageInHours = articleAge / (1000 * 60 * 60);
  
  // Base score from 24h views
  let score = this.viewsLast24h * 100;
  
  // Velocity bonus: if article is getting views quickly relative to its age
  if (ageInHours > 0) {
    const viewsPerHour = this.viewsLast24h / Math.min(ageInHours, 24);
    score += viewsPerHour * 50;
  }
  
  // Recency boost: newer articles (< 48 hours) get a boost
  if (ageInHours < 48) {
    const recencyBoost = (48 - ageInHours) / 48 * 200;
    score += recencyBoost;
  }
  
  // Small bonus for total engagement
  score += Math.min(this.views * 0.1, 100);
  
  return Math.round(score);
};

// Method to calculate popular score
// Formula: weighted combination of 7d views and engagement
ArticleSchema.methods.calculatePopularScore = function() {
  const now = Date.now();
  const articleAge = now - new Date(this.createdAt).getTime();
  const ageInDays = articleAge / (1000 * 60 * 60 * 24);
  
  // Base score from 7-day views
  let score = this.viewsLast7d * 100;
  
  // Consistency bonus: articles with sustained views over the week
  if (ageInDays >= 7) {
    const avgViewsPerDay = this.viewsLast7d / 7;
    score += avgViewsPerDay * 30;
  } else if (ageInDays > 0) {
    const avgViewsPerDay = this.viewsLast7d / ageInDays;
    score += avgViewsPerDay * 30;
  }
  
  // Slight recency factor (newer content preferred over older)
  if (ageInDays < 14) {
    const recencyFactor = (14 - ageInDays) / 14;
    score += recencyFactor * 100;
  }
  
  // Engagement bonus from likes
  score += this.likes * 20;
  
  return Math.round(score);
};

// Method to update all scores and rolling counts
ArticleSchema.methods.updateScores = async function(viewCounts24h = null, viewCounts7d = null) {
  // Update rolling window counts if provided (from cron job aggregation)
  if (viewCounts24h !== null) {
    this.viewsLast24h = viewCounts24h;
  }
  if (viewCounts7d !== null) {
    this.viewsLast7d = viewCounts7d;
  }
  
  // Recalculate scores
  this.trendingScore = this.calculateTrendingScore();
  this.popularScore = this.calculatePopularScore();
  this.lastScoreUpdate = new Date();
  
  await this.save({ validateBeforeSave: false });
};

// Static method to bulk update scores (for cron jobs)
ArticleSchema.statics.bulkUpdateScores = async function(timeWindow = '24h') {
  const ViewLog = mongoose.model('ViewLog');
  const now = new Date();
  
  let since, viewCountsMap;
  
  if (timeWindow === '24h') {
    // Calculate 24h rolling counts
    since = new Date(now - 24 * 60 * 60 * 1000);
    
    const viewCounts = await ViewLog.aggregate([
      { $match: { viewedAt: { $gte: since } } },
      { $group: { _id: '$article', count: { $sum: 1 } } }
    ]);
    
    viewCountsMap = new Map(viewCounts.map(v => [v._id.toString(), v.count]));
    
    // Update all articles
    const articles = await this.find({});
    
    for (const article of articles) {
      const count24h = viewCountsMap.get(article._id.toString()) || 0;
      article.viewsLast24h = count24h;
      article.trendingScore = article.calculateTrendingScore();
      article.lastScoreUpdate = now;
      await article.save({ validateBeforeSave: false });
    }
    
    return { updated: articles.length, timeWindow: '24h' };
    
  } else if (timeWindow === '7d') {
    // Calculate 7d rolling counts
    since = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    const viewCounts = await ViewLog.aggregate([
      { $match: { viewedAt: { $gte: since } } },
      { $group: { _id: '$article', count: { $sum: 1 } } }
    ]);
    
    viewCountsMap = new Map(viewCounts.map(v => [v._id.toString(), v.count]));
    
    // Update all articles
    const articles = await this.find({});
    
    for (const article of articles) {
      const count7d = viewCountsMap.get(article._id.toString()) || 0;
      article.viewsLast7d = count7d;
      article.popularScore = article.calculatePopularScore();
      article.lastScoreUpdate = now;
      await article.save({ validateBeforeSave: false });
    }
    
    return { updated: articles.length, timeWindow: '7d' };
  }
};

module.exports = mongoose.model('Article', ArticleSchema);