import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../src/config/config.js";
import { newId } from "../src/utils/id.js";
import fs from "fs";
import Papa from "papaparse";
import { faker } from "@faker-js/faker";
import { extractData } from "./scrapData.js";
import { scrapeImages } from "./scrapImg.js";
const CHUNK_SIZE = 1; //  how many products to process at once
// const MAX_PRODUCTS = 4; // Limit of products to import
let lastProcessedIndex = 0; // This will keep track of the last processed line
let startPosition = 45000;

async function importProductsFromCSV(filePath) {
  try {
    await mongoose.connect(MONGODB_CNX_STR);
    console.log("Connected to MongoDB.");

    const productSchema = new mongoose.Schema(
      {
        _id: { type: String, default: newId, required: true },
        title: { type: String, index: true, required: true },
        attribute: { type: String },
        description: { type: Object, required: true },
        brand: { type: String },
        code: { type: String, required: true, unique: true },
        avgRating: { type: Number },
        ratings: { type: Number },
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        status: { type: String, default: true, required: false },
        stock: { type: Number, required: true },
        category: { type: Number, required: true },
        badge: { type: String },
        productURL: { type: String },
        thumbnail: {
          type: [String],
          default: ["static/img/defaults/thumbnailDefault.png"],
          required: false,
        },
        boughtInLastMonth: { type: Number },
      },
      { versionKey: false, strict: "throw" }
    );
    const Product = mongoose.model("Product", productSchema);

    // Parse CSV
    let rows = [];
    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      Papa.parse(stream, {
        header: true,
        skipEmptyLines: true,
        step: (result) => {
          rows.push(result.data);
        },
        complete: resolve,
        error: reject,
      });
    });

    // Modification of data
    for (let i = startPosition; i < rows.length; i += CHUNK_SIZE) {
      const chunkEnd = Math.min(i + CHUNK_SIZE, rows.length);
      let productsChunk = [];
      console.log(`chunk: ${i}`)
      const products = [];
      // for (let product of rows.slice(0, MAX_PRODUCTS)) {
      for (let j = i; j < chunkEnd; j++) {
        const product = rows[j];
        console.log(`product: ${j}`)
        // transformation logic
        // Check the isBestSeller field and set the badge field accordingly
        if (product.isBestSeller === "True") {
          product.badge = "bestseller";
        }
        // Convert oldPrice to an empty string if it is 0
        if (parseFloat(product.oldPrice) === 0) {
          product.oldPrice = "";
        }
        // scrap data
        let productDetail;
        try {
          productDetail = await extractData(product.productURL);
          product.description = productDetail; // Assuming extractData returns an object with a description property
          // console.log(product.description);
          product.stock = faker.number.int({ min: 0, max: 5000 });
        } catch (error) {
          console.error("Error scraping product data:", error.message);
          continue; // Skip this product or use a default value
        }
        // scrap product images
        let thumbnail = [];
        // try {
        //   let imageSources = await scrapeImages(product.productURL);
        //   thumbnail = imageSources.filter(
        //     (src) => !src.includes("grey-pixel.gif")
        //   );
        // } catch (error) {
        //   console.error("Error scraping product Img:", error.message);
        //   continue; // Skip this product or use a default value
        // }
        // console.log(thumbnail);
        if (!Array.isArray(thumbnail) || thumbnail.length !== 0) {
          product.thumbnail = thumbnail;
        }
        console.log(product.productURL)

        // delete product.productURL; // Exclude productURL
        delete product.isBestSeller; // Exclude isBestSeller

        productsChunk.push(product);
      }

      // Database insertion logic
      if (productsChunk.length > 0) {
        try {
          const result = await Product.insertMany(
            productsChunk
          ); 
          console.log(result)
          console.log(`Inserted ${result.length} products.`);
          lastProcessedIndex = chunkEnd;
          console.log(`Last row inserted ${lastProcessedIndex}.`);
        } catch (error) {
          console.error(`Error inserting products ${i} to ${chunkEnd}:`, error.message);
          // Stop the loop on error, or handle this as needed
        }
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

// Replace `path` with your actual CSV file path
const path = "C:/Users/korid/Downloads/amazon_products.csv";
await importProductsFromCSV(path);
