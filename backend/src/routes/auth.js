const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { login, logout, registerOneSignal } = require('../controllers/authController');

const router = express.Router();

// POST /auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], login);

// POST /auth/logout
router.post('/logout', authenticateToken, logout);

// POST /auth/onesignal
router.post('/onesignal', authenticateToken, registerOneSignal);

module.exports = router; 