const scraperDispatcher = require('../scrapers/scraperDispatcher');
const performVisualSearch = require('../services/visualSearchService');
const catchAsync = require('../utils/catchAsync');
const generate = require('../services/GenerateImageAI');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

exports.setImageName = (req, res, next) => {
  req.imageName = req.file.filename;

  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const imageName = file.fieldname + '-' + uniqueSuffix + ext;
    req.imageName = imageName;

    cb(null, imageName);
  },
});

exports.deleteImage = (req, res, next) => {
  //console.log(req.zaras);
  console.log(req.imageName);
  const imagePath = path.join(__dirname, '..', 'public', 'img', req.imageName);
  console.log(imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error :', err);
      next();
    } else {
      res.status(200).json({
        status: 'success',
        results: req.zaras.length,
        data: req.zaras,
      });
    }
  });
};

const convertToJpg = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const outputPath = path.join(__dirname, '../public/img/', filename);

  try {
    await sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(outputPath);

    // Dodaj info o fajlu u req.file
    req.file.path = outputPath;
    req.file.filename = filename;
    next();
  } catch (err) {
    next(err);
  }
};

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.visualSearch = catchAsync(async (req, res, next) => {
  let page;
  let pageSize;
  if (req.query.page) {
    page = req.query.page;
    pageSize = 1;
  } else {
    page = 1;
    pageSize = 5;
  }
  let imageUrl;
  if (req.image) {
    imageUrl = req.image;
  } else {
    if (process.env.NODE_ENV.trim() == 'production') {
      if (req.file) {
        imageUrl = `${process.env.HOST}/public/img/${req.imageName}`;
      }
    } else {
      if (req.file) {
        imageUrl = `${process.env.HOST}/public/img/${req.imageName}`;
      } else {
        imageUrl = req.query.image;
      }
    }
  }
  console.log(imageUrl);
  const result = await performVisualSearch.performVisualSearch(
    imageUrl,
    page,
    pageSize,
  );

  const ress = await Promise.all(
    result.map(async (element) => {
      const resScrape = await scraperDispatcher(element.brand, element.link);
      element.image = resScrape.product_image;
      element.price.value = element.price.value.current;

      return element;
    }),
  );

  // res.status(200).json({
  //   status: 'success',
  //   results: ress.length,
  //   data: ress,
  // });
  req.zaras = ress;
  next();
});

exports.visualSearchByPrompt = catchAsync(async (req, res, next) => {
  const imageName = await generate(req.body.prompt);
  req.imageName = imageName;
  if (process.env.NODE_ENV.trim() === 'production') {
    req.image = `${process.env.HOST}/public/img/${imageName}`;
  } else {
    req.image = req.query.image;
  }

  next();
});
