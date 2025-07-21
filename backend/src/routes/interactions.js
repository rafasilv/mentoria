const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorizeMentorado } = require('../middleware/auth');
const { 
  createInteraction, 
  getPlanInteractions, 
  getMyTodayInteractions 
} = require('../controllers/interactionController');

const router = express.Router();

// POST /interactions
router.post('/', [
  authenticateToken,
  authorizeMentorado,
  body('plan_id').notEmpty().withMessage('ID do plano é obrigatório'),
  body('plan_version_id').notEmpty().withMessage('ID da versão do plano é obrigatório'),
  body('horario_programado').notEmpty().withMessage('Horário programado é obrigatório'),
  body('status').isIn(['REALIZADO', 'NAO_REALIZADO']).withMessage('Status inválido'),
  body('justificativa').optional().notEmpty().withMessage('Justificativa não pode ser vazia')
], createInteraction);

// GET /interactions/plan/:plan_id
router.get('/plan/:plan_id', authenticateToken, getPlanInteractions);

// GET /interactions/today
router.get('/today', authenticateToken, authorizeMentorado, getMyTodayInteractions);

module.exports = router; 