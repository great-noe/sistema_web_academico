const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { registerRules, loginRules, updateProfileRules, updatePasswordRules } = require('../middlewares/validation.middleware');

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, updateProfileRules, authController.updateProfile);
router.put('/profile/password', authMiddleware, updatePasswordRules, authController.updatePassword);

module.exports = router;
