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
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: true
  }
});

ViewLogSchema.index({ article: 1, identifier: 1, viewedAt: -1 });
ViewLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ViewLog', ViewLogSchema);