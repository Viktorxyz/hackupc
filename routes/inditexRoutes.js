const express = require('express');
const inditexController = require('../controllers/indtitexController');

const router = express.Router();

router
  .route('/visual-search')
  .post(inditexController.uploadImage, inditexController.visualSearch);
router
  .route('/:prompt')
  .post(inditexController.visualSearchByPrompt, inditexController.visualSearch);

module.exports = router;
