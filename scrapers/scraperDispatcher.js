const zaraScraper = require('./zaraScraper');
const pullAndBearScraper = require('./pullAndBearScraper');
const massimoDuttiScraper = require('./massimoDutti');
const bershkaScraper = require('./bershkaScraper');
const oyshoScraper = require('./oyshoScraper');
const stradivariusScraper = require('./stradivariusScraper');

module.exports = async function scrapeProduct(brand, url, location = null) {
  switch (brand.toLowerCase()) {
    case 'zara':
      return await zaraScraper(url, location);
    case 'pull&bear':
    case 'pullandbear':
      return await pullAndBearScraper(url, location);
    case 'massimo dutti':
    case 'massimodutti':
      return await massimoDuttiScraper(url, location);
    case 'bershka':
      return await bershkaScraper(url, location);
    case 'oysho':
      return await oyshoScraper(url, location);
    case 'stradivarius':
      return await stradivariusScraper(url, location);
    case 'zara home':
    case 'zarahome':
      return await zaraHomeScraper(url, location);
    default:
      throw new Error('Unsupported brand: ' + brand);
  }
};
