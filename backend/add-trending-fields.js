// migrations/add-trending-fields.js
const mongoose = require('mongoose');

// Load .env (adjust path if needed)
require('dotenv').config();

const Article = require('./models/Article');

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const result = await Article.updateMany(
    {},
    {
      $set: {
        recentViews: [],
        isTrending: false,
        lastTrendingCheck: new Date()
      }
    }
  );

  console.log(`✔ Updated ${result.modifiedCount} articles`);

  await Article.syncIndexes(); // Optional
  process.exit(0);
}

migrate();
