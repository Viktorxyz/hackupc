const puppeteer = require("puppeteer");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async function zaraScraper(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  // Set realistic browser headers
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait specifically for product images to load
    await page.waitForSelector(".media-image__image.media__wrapper--media", {
      timeout: 15000
      // visible: false
    });

    // Extract only image data
    // await delay(1000)
    // Extract only the first image URL
    const firstImageUrl = await page.evaluate(() => {
      const img = document.querySelector(".media-image__image.media__wrapper--media");
      return img ? img.src : null;
    });

    if (!firstImageUrl) {
      throw new Error("No product image found on page");
    }

    await browser.close();
    return { 
      product_url: url,
      product_image: firstImageUrl 
    };
  } catch (error) {
    await browser.close();
    console.error("Scraping error:", error);
    throw new Error(`Failed to scrape product images: ${error.message}`);
  }
};