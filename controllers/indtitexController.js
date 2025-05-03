exports.test = (req, res, next) => {
  console.log("hello");
  res.status(200).json({
    status: "success",
    // body: {    }
  });
  next();
};
