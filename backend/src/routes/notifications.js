const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorizeMentor } = require('../middleware/auth');
const { testSummaryNotification } = require('../controllers/notificationController');

const router = express.Router();

// POST /notifications/test-summary (apenas para testes)
router.post('/test-summary', [
  authenticateToken,
  authorizeMentor,
  body('mentorado_id').notEmpty().withMessage('ID do mentorado é obrigatório')
], testSummaryNotification);

module.exports = router; 