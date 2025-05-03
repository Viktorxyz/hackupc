const express = require("express");
const inditexController = require("../controllers/indtitexController");

const router = express.Router();

router.route("/").get(inditexController.test);

module.exports = router;
