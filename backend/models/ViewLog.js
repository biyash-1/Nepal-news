// models/ViewLog.js
const mongoose = require('mongoose');

const ViewLogSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
    index: true
  },
  identifier: {
    type: String,
    required: true,
    index: true
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    // Extended to 7 days to support popular news calculation
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    index: true
  }
});

// Compound indexes for efficient queries
ViewLogSchema.index({ article: 1, identifier: 1, viewedAt: -1 });
ViewLogSchema.index({ article: 1, viewedAt: -1 }); // For aggregation queries
ViewLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('ViewLog', ViewLogSchema);