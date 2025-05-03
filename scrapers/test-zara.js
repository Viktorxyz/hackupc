const scrapeZara = require("./zaraScraper.js");

(async () => {
  const url = "https://www.zara.com/es/en/plain-knit-sweater-p06216001.html"; // use a real product URL here
  try {
    const result = await scrapeZara(url);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
