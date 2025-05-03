const scraperDispatcher = require('../scrapers/scraperDispatcher');
const performVisualSearch = require('../services/visualSearchService');
const catchAsync = require('../utils/catchAsync');
const generate = require('../services/GenerateImageAI');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.visualSearch = catchAsync(async (req, res, next) => {
  let imageUrl;
  if (process.env.NODE_ENV.trim() == 'production') {
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/public/img/${req.file.originalname}`;
    }
  } else {
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/public/img/${req.file.originalname}`;
    } else {
      imageUrl = req.query.image;
    }
  }
  console.log(imageUrl);
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
  const imageName = await generate(req.params.prompt);
  req.image = imageName; // url from server
  next();
});
