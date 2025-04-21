const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all achievement routes
router.use(authMiddleware);

// Route to get all achievements
router.get('/all', (req, res, next) => {
  try {
    return achievementController.getAllAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to get user's achievements
router.get('/user', (req, res, next) => {
  try {
    return achievementController.getUserAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to check for new achievements
router.post('/check', (req, res, next) => {
  try {
    return achievementController.checkAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;