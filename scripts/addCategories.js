import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../src/config/config.js";
import { newId } from "../src/utils/id.js";
import fs from "fs/promises"; // Use fs promises API for async read

let lastProcessedIndex = 0; // This will keep track of the last processed line

async function importProductsFromCSV(filePath) {
  try {
    await mongoose.connect(MONGODB_CNX_STR);
    console.log("Connected to MongoDB.");

    const categorySchema = new mongoose.Schema(
      {
        _id: { type: String, default: newId, required: true },
        name: { type: String, index: true },
        subcategories: [
          {
            id: { type: Number },
            name: { type: String },
          },
        ],
      },
      { versionKey: false, strict: "throw" }
    );
    const Category = mongoose.model("Category", categorySchema);

    // Read the JSON file
    const data = await fs.readFile(filePath, { encoding: "utf8" });
    const categoriesData = JSON.parse(data);

    // Database insertion logic

    try {
      const result = await Category.insertMany(categoriesData);
      console.log(`Inserted ${result.length} categories.`);
      console.log(`Last row inserted ${lastProcessedIndex}.`);
    } catch (error) {
      console.error(`Error inserting ctegories:`, error.message);
      // Stop the loop on error, or handle this as needed
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

// Replace `path` with your actual CSV file path
const path = "C:/Users/korid/Downloads/amazon_categories_restructured.json";
await importProductsFromCSV(path);
