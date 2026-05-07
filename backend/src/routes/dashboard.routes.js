const express = require('express');
const controller = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/stats', authMiddleware, controller.getStats);

module.exports = router;