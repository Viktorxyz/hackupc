const express = require('express');
const inditexController = require('../controllers/indtitexController');

const router = express.Router();

router
  .route('/visual-search')
  .post(inditexController.uploadImage, inditexController.visualSearch);
router
  .route('/visual-search/prompt')
  .post(
    inditexController.visualSearchByPrompt,
    inditexController.uploadImage,
    inditexController.visualSearch,
  );

module.exports = router;
