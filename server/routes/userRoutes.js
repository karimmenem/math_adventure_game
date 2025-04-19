// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all user routes
router.use(authMiddleware);

// User routes
router.get('/progress', userController.getUserProgress);
router.get('/high-scores', userController.getHighScores);
router.post('/stats', userController.updateUserStats);

module.exports = router;