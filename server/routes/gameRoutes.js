const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all game routes
router.use(authMiddleware);

// Game routes
router.post('/start', gameController.startGame);
router.get('/problems', gameController.getProblems);
router.get('/practice', gameController.getPracticeProblems);
router.post('/submit', gameController.submitAnswer);
router.post('/end', gameController.endGame);

module.exports = router;