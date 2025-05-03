const scrapeBershka = require("./zaraScraper.js");

(async () => {
  const url = "https://www.zara.com/es/en/hello-kitty---2025-sanrio-washed-effect-t-shirt-p06050356.html?v1=446120522&v2=2420417"; // use a real product URL here
  try {
    const result = await scrapeBershka(url);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
