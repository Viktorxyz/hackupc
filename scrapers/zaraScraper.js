const puppeteer = require("puppeteer");

module.exports = async function zaraScraper(url) {
  const browser = await puppeteer.launch({
    headless: "new",
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

  // Reduce bot detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForSelector("img", { timeout: 15000 });

    // Get the first visible image
    const firstImageUrl = await page.evaluate(() => {
      const images = document.querySelectorAll("img");
      for (const img of images) {
        if (img.complete && img.naturalWidth > 0) {
          return img.src;
        }
      }
      return null;
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