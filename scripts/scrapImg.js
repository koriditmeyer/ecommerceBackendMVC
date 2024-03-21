import puppeteer from 'puppeteer'

// const url = "https://www.amazon.com/dp/B07TH62PB8";

export async function scrapeImages(url) {
    // Launch a new browser session.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Go to the specified URL.
    console.log(url)
    await page.goto(url, { waitUntil: 'networkidle0' });
  
    // Find all the thumbnail elements on the page.
    const thumbnailElements = await page.$$('#altImages li.imageThumbnail');
  
    for (let elementHandle of thumbnailElements) {
      // Click on each thumbnail element.
      await elementHandle.click();
      
      // Wait for some time after each click to allow the image to load.
    //   await page.waitForTimeout(1000); // The timeout may need to be adjusted.
    }
  
    // Extract the src for each large image now that they are all loaded.
    const imageSources = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('#main-image-container img'));
      return images.map(img => img.src);
    });
  
    // Close the browser session.
    await browser.close();
  
    return imageSources;
  }
  
  // Use the function and print the results.
//   scrapeImages(url).then(imageSources => {
//     console.log('Image Sources:', imageSources.filter(src => !src.includes('grey-pixel.gif')));
//   });