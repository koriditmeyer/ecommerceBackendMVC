import axios from "axios";
import cheerio from "cheerio";

const url = "https://www.amazon.com/dp/B07H515VCZ";

async function fetchData(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        // Some websites may require a user-agent or other headers to allow requests
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

function cleanProductDetails(details) {
  const cleanedDetails = {}; // Create a new object to hold the cleaned details

  Object.keys(details).forEach((originalKey) => {
    let value = details[originalKey]
      .replace(/[:\u200B-\u200D\uFEFF]+$/, "") // Remove invisible Unicode characters
      .replace(/\s+/g, " ")
      .trim();

    let key = originalKey
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space throughout
      .replace(
        /[\u200B-\u200D\uFEFF\u202F\u200E\u200F\s]*:[\u200B-\u200D\uFEFF\u202F\u200E\u200F\s]*/g,
        ""
      )
      .trim();

    // Check if the value is not empty and the key is not specifically excluded
    if (
      value !== "" &&
      key !== "" &&
      key !== "Customer Reviews" &&
      key !== "Best Sellers Rank"
    ) {
      cleanedDetails[key] = value; // Assign the cleaned value to the cleaned key in the new object
    }
  });
  return cleanedDetails;
}

export async function extractData(url) {
  const html = await fetchData(url);
  if (!html) return;

  const $ = cheerio.load(html);

  // Remove all script tags from the document
  $("script").remove();
  $("style").remove();

  let features = [];
  $("#feature-bullets ul li span").each(function () {
    // Extract text from each list item
    const feature = $(this).text().trim();
    features.push(feature);
  });

  // Initialize an empty object to hold the product details
  let productDetailsObj = {};

  // Select the product details table and iterate over each row
  $("#prodDetails tr").each(function () {
    // For each row, find the 'th' and 'td' elements
    const key = $(this).find("th").text().trim();
    const value = $(this).find("td").text().trim();

    // Use the text from 'th' as the key and 'td' as the value in the object
    productDetailsObj[key] = value;
  });

  if (productDetailsObj.length === 0) {
    // Select the detail bullets list and iterate over each list item
    $("#detailBullets_feature_div .a-unordered-list .a-list-item").each(
      function () {
        // The key is in the first span with class 'a-text-bold'
        const key = $(this).find(".a-text-bold").first().text().trim();

        // The value follows the key span
        const value = $(this)
          .find(".a-text-bold")
          .first()
          .next("span")
          .text()
          .trim();

        // Use the text from the first span as the key and the following text as the value in the object
        productDetailsObj[key] = value;
      }
    );
  }

  // Remove excessive whitespace and line breaks && Empty  entries and product reviews
  productDetailsObj = cleanProductDetails(productDetailsObj);

  //scrap description
  let productDescription = [];
  $("#productDescription p").each(function () {
    // Extract text from each list item
    const feature = $(this).text().trim();
    feature && productDescription.push(feature);
  });

  const scrappedData= {
    features: features,
    information: productDetailsObj,
    description: productDescription,
  };
//   console.log(scrappedData)
  return scrappedData
}

extractData(url);
