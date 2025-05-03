const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.route('/scan-image').post(viewController.uploadImage);

module.exports = router;
