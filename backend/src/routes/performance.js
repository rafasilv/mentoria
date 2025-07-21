const express = require('express');
const { authenticateToken, authorizeMentor } = require('../middleware/auth');
const { 
  getPlanPerformance, 
  getGoalPerformance, 
  getMentoradoPerformance 
} = require('../controllers/performanceController');

const router = express.Router();

// GET /performance/plan/:plan_id
router.get('/plan/:plan_id', authenticateToken, getPlanPerformance);

// GET /performance/goal/:goal_id
router.get('/goal/:goal_id', authenticateToken, getGoalPerformance);

// GET /performance/mentorado/:mentorado_id
router.get('/mentorado/:mentorado_id', authenticateToken, authorizeMentor, getMentoradoPerformance);

module.exports = router; 