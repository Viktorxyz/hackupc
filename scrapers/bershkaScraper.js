const puppeteer = require("puppeteer");

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

    // Wait for either product name or price to load
    await Promise.race([
      page.waitForSelector('[data-qa-anchor="pdpMainImage"]', { timeout: 10000 }),
      page.waitForSelector('[data-qa-anchor="productItemPrice"]', { timeout: 10000 }),
      page.waitForSelector(".product-detail-info-layout__title", { timeout: 10000 })
    ]);

    // Extract product data
    const productData = await page.evaluate((externalURL) => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };

      const getImage = () => {
        // Try data-qa first, then fallback to class
        const img = document.querySelector('[data-qa-anchor="pdpMainImage"]') || 
                   document.querySelector(".image-item");
        return img ? img.src || img.getAttribute("data-original") : null;
      };

      return {
        product_url: externalURL,
        product_name: getText(".product-detail-info-layout__title"),
        product_price: getText('[data-qa-anchor="productItemPrice"]'),
        product_image: getImage()
      };
    }, url);

    // Validate essential data
    if (!productData.product_name || !productData.product_price) {
      throw new Error("Essential product data not found on page");
    }

    await browser.close();
    return productData;
  } catch (error) {
    await browser.close();
    console.error("Scraping error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
};