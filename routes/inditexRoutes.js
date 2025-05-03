const express = require("express");
const inditexController = require("../controllers/indtitexController");

const router = express.Router();

router.route("/").get(inditexController.visualSearch);

module.exports = router;
