const fs = require("fs").promises;
const path = require("path");

// Input and output JSON file paths
const INPUT_FILE = path.join(__dirname, "data/news.json");
const OUTPUT_FILE = path.join(__dirname, "data/news_updated.json");

(async () => {
  try {
    // Read existing data
    const rawData = await fs.readFile(INPUT_FILE, "utf-8");
    const newsData = JSON.parse(rawData);

    // Get images from id 1–20 (or first 20 records)
    const workingImages = newsData
      .filter(item => parseInt(item.id) >= 1 && parseInt(item.id) <= 20)
      .map(item => item.image);

    console.log(`Collected ${workingImages.length} working images.`);

    if (workingImages.length === 0) {
      throw new Error("No images found in IDs 1–20. Please check your data.");
    }

    // Replace image for records beyond id 20
    const updatedData = newsData.map((item, index) => {
      if (parseInt(item.id) > 20) {
        // Use image based on index cycle
        const newImage = workingImages[(index - 20) % workingImages.length];
        return { ...item, image: newImage };
      }
      return item; // Keep original if id <= 20
    });

    // Save to a new file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(updatedData, null, 2), "utf-8");
    console.log("Image replacement completed. Saved to:", OUTPUT_FILE);
    
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
