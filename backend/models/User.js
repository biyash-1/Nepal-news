const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Article = require('./Article');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
  type: String,
  minlength: 6,
  required: function() {
    return !this.googleId; 
  }
},
  googleId: {
    type: String,
    unique: true,
    sparse: true 
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  role: {
    type: String,
    enum: ['reader', 'editor', 'admin'],
    default: 'reader'
  },
  savedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  preferences: {
    categories: [String],
    newsletter: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

// Hash password only if it exists
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
