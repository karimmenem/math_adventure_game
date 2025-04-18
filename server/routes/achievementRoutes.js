const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all achievement routes
router.use(authMiddleware);

// Achievement routes
router.get('/all', achievementController.getAllAchievements);
router.get('/user', achievementController.getUserAchievements);
router.post('/check', achievementController.checkAchievements);

module.exports = router;