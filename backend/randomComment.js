// generateComments.js

const mongoose = require("mongoose");
require("dotenv").config();

const Article = require("./models/Article");
const User = require("./models/User");
const Comment = require("./models/Comment");

const MONGODB_URI = process.env.MONGODB_URI;

// Some random Nepali comments
const sampleComments = [
  "यो समाचार निकै रोचक लाग्यो।",
  "मलाई यो कुरा सहि लागेको छैन।",
  "धेरै राम्रो लेखिएको छ। धन्यवाद!",
  "यो विषयमा अझ विस्तृत जानकारी चाहिन्छ।",
  "लेख राम्रो तर स्रोत उल्लेख गर्नुपर्छ।",
  "यो पढ्दा गर्व महसुस भयो।",
  "के यो सत्य हो? कृपया पुष्टि गर्नुहोस्।",
  "राम्रो प्रयास।",
  "यो भन्दा थप विवरण दिनुहोस्।",
  "असहमत छु, तर विचार राम्रो छ।"
];

// Random number generator
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("📦 MongoDB Connected");

    // Get all articles & users
    const articles = await Article.find({});
    const users = await User.find({});

    if (!users.length) throw new Error("⚠ कुनै प्रयोगकर्ता (User) फेला परेन।");
    if (!articles.length) throw new Error("⚠ कुनै लेख (Article) फेला परेन।");

    console.log(`📝 Generating comments for ${articles.length} articles`);
    const commentsToInsert = [];

    for (const article of articles) {
      const numberOfComments = randomBetween(1, 5);

      for (let i = 0; i < numberOfComments; i++) {
        const randomUser = users[randomBetween(0, users.length - 1)];
        const randomComment = sampleComments[randomBetween(0, sampleComments.length - 1)];

        // Generate likes & dislikes (random)
        const likes = [];
        const dislikes = [];

        users.forEach((u) => {
          if (Math.random() < 0.1) likes.push(u._id);       // 10% chance to like
          if (Math.random() < 0.03) dislikes.push(u._id);   // 3% chance to dislike
        });

        commentsToInsert.push({
          article: String(article._id),
          user: randomUser._id,
          content: randomComment,
          likes,
          dislikes,
          isEdited: false,
        });
      }
    }

    // Insert into DB
    const insertedComments = await Comment.insertMany(commentsToInsert);

    console.log(`🚀 Successfully added ${insertedComments.length} random comments!`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error generating comments:", error);
    process.exit(1);
  }
})();
