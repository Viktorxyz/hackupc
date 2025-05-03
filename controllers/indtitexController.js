const scraperDispatcher = require('../scrapers/scraperDispatcher');
const performVisualSearch = require('../services/visualSearchService');
const catchAsync = require('../utils/catchAsync');
const generate = require('../services/GenerateImageAI');

const getProducts = catchAsync(async function (arr) {
  const ress = await Promise.all(
    arr.map(async (element) => {
      const resScrape = await scraperDispatcher(element.brand, element.link);
      element.image = resScrape.product_image;

      return element;
    }),
  );
  console.log(ress);
  return ress;
});

exports.visualSearch = catchAsync(async (req, res, next) => {
  const imageUrl = req.query.image;
  const result = await performVisualSearch.performVisualSearch(imageUrl);

  if (result.length === 0) {
    return res.status(200).json({ message: 'There are no products' });
  }
  const ress = await Promise.all(
    result.map(async (element) => {
      const resScrape = await scraperDispatcher(element.brand, element.link);
      element.image = resScrape.product_image;
      element.price.value = element.price.value.current;

      return element;
    }),
  );

  res.status(200).json({
    status: 'success',
    results: ress.length,
    data: ress,
  });

  next();
});

exports.visualSearchByPrompt = catchAsync(async (req, res, next) => {
  generate(req.params.prompt);
  next();
});
