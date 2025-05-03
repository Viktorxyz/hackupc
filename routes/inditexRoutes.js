const express = require('express');
const inditexController = require('../controllers/indtitexController');

const router = express.Router();

router.route('/').get(inditexController.visualSearch);
router.route('/:prompt').get(inditexController.visualSearchByPrompt);

module.exports = router;
