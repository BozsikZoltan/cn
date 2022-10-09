const express = require('express');
const router = express.Router();
/**
 * Route's controller
 * */
const controller = require('../controllers/domain');

/**
 * Using the controller's different routes to reach the domain's specific function.
 * */
router.get('/', controller.getKeys);
router.post('/set', controller.setKey);
router.post('/delete', controller.deleteKey);

module.exports = router;
