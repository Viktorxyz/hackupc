const express = require('express');
const inditexController = require('../controllers/indtitexController');

const router = express.Router();

router
  .route('/visual-search')
  .post(
    inditexController.uploadImage,
    inditexController.setImageName,
    inditexController.visualSearch,
    inditexController.deleteImage,
  );
router
  .route('/visual-search/prompt')
  .post(
    inditexController.visualSearchByPrompt,
    inditexController.visualSearch,
    inditexController.deleteImage,
  );

module.exports = router;
