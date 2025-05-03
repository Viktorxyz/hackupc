
const performVisualSearch = require("../services/visualSearchService")
const catchAsync = require("../utils/catchAsync")

exports.visualSearch = catchAsync(async (req, res, next) => {
  
    const imageUrl = req.query.image;
    const result = await performVisualSearch.performVisualSearch(imageUrl);

    if (result.length === 0) {
      return res.status(200).json({ message: 'There are no products' });
    }

    res.status(200).json({
      status: "success",
      result
    })
  


  next();
});
