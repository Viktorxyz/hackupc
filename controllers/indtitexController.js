const performVisualSearch = require("../services/visualSearchService")


exports.visualSearch = async (req, res, next) => {
  try {
    const imageUrl = req.query.image;
    const result = await performVisualSearch.performVisualSearch(imageUrl);

    if (result.length === 0) {
      return res.status(404).json({ message: 'There are no products' });
    }

    res.status(200).json({
      status: "success",
      result
    })
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Greška u vizuelnoj pretrazi' });
  }
  next();
};
