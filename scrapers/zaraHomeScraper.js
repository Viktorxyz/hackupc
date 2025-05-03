const puppeteer = require("puppeteer");

module.exports = async function massimoDutiScraper(url) {
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode for production
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
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for either the product name or price to appear as confirmation the page loaded
    await Promise.race([
      page.waitForSelector(".product-name", {
        timeout: 10000,
      }),
      page.waitForSelector(".product-price", { timeout: 10000 }),
    ]);

    // Extract data with fallbacks if selectors aren't found
    const productData = await page.evaluate((externalURL) => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };

      const getImage = () => {
        const img = document.querySelector(".product-media__img").getElementsByTagName("img")[0]; //media-image__image media__wrapper--media
        return img ? img.src : null;
      };

      return {
        product_url: externalURL,
        product_image: getImage()
      };
    }, url);

    // if (!productData.product_name || !productData.product_price) {
    //   throw new Error("Essential product data not found on page");
    // }

    await browser.close();
    return productData;
  } catch (error) {
    await browser.close();
    console.error("Scraping error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
};
