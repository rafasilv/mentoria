const express = require('express');
const { authenticateToken, authorizeMentor, authorizeMentorado } = require('../middleware/auth');
const { getMe, getMentorados, getMentor } = require('../controllers/userController');

const router = express.Router();

// GET /users/me
router.get('/me', authenticateToken, getMe);

// GET /users/mentorados
router.get('/mentorados', authenticateToken, authorizeMentor, getMentorados);

// GET /users/mentor
router.get('/mentor', authenticateToken, authorizeMentorado, getMentor);

module.exports = router; 