const puppeteer = require("puppeteer");

module.exports = async function oyshoScraper(url) {
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

    // Wait for either product name, price or image to load
    await Promise.race([
      page.waitForSelector('[data-testid="media-image"]', { timeout: 10000 }),
      page.waitForSelector('[data-testid="multi-currency-wrapper-price"]', { timeout: 10000 }),
      page.waitForSelector(".product-info__name", { timeout: 10000 })
    ]);

    // Extract product data
    const productData = await page.evaluate((externalURL) => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };

      const getImage = () => {
        // Get the best available image URL from srcset or src
        const img = document.querySelector('[data-testid="media-image"]');
        if (!img) return null;
        
        // Try to get the highest resolution from srcset
        const srcset = img.getAttribute("srcset");
        if (srcset) {
          const sources = srcset.split(", ");
          // Get the highest resolution (last one in the list)
          const highestRes = sources[sources.length - 1].split(" ")[0];
          return highestRes;
        }
        // Fallback to src if no srcset
        return img.src;
      };

      return {
        product_url: externalURL,
        product_name: getText(".product-info__name"),
        product_price: getText('[data-testid="multi-currency-wrapper-price"]'),
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