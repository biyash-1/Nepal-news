// config/trendingConfig.js

/**
 * Trending Configuration
 * Adjust these values based on your traffic and testing needs
 */

const trendingConfig = {
  // Minimum views in the time window to be trending
  minRecentViews: 50, // Start with 50, adjust based on traffic
  
  // Time window in hours to check recent views
  timeWindowHours: 24, // Last 24 hours
  
  // Minimum total views to be trending (alternative criteria)
  minTotalViews: 200, // Total views threshold
  
  // How often to check trending status (in minutes)
  checkIntervalMinutes: 60, // Check every hour
  
  // View count delay (seconds user must stay on page)
  viewCountDelay: 20, // Count after 20 seconds
};

// Helper function to get dynamic config (can be updated from admin panel later)
const getTrendingConfig = () => {
  // In the future, you can fetch this from database
  // For now, return the static config
  return trendingConfig;
};

// Update config (for future admin panel)
const updateTrendingConfig = (updates) => {
  Object.assign(trendingConfig, updates);
  console.log('Trending config updated:', trendingConfig);
};

module.exports = {
  trendingConfig,
  getTrendingConfig,
  updateTrendingConfig
};