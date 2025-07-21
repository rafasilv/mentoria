const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorizeMentor, authorizeMentorado } = require('../middleware/auth');
const { 
  createGoal, 
  updateGoal, 
  updateGoalStatus, 
  getMentoradoGoals, 
  getMyGoals 
} = require('../controllers/goalController');

const router = express.Router();

// POST /goals
router.post('/', [
  authenticateToken,
  authorizeMentor,
  body('mentorado_id').notEmpty().withMessage('ID do mentorado é obrigatório'),
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('data_limite').isISO8601().withMessage('Data limite inválida')
], createGoal);

// PUT /goals/:id
router.put('/:id', [
  authenticateToken,
  authorizeMentor,
  body('titulo').optional().notEmpty().withMessage('Título não pode ser vazio'),
  body('data_limite').optional().isISO8601().withMessage('Data limite inválida')
], updateGoal);

// PATCH /goals/:id/status
router.patch('/:id/status', [
  authenticateToken,
  authorizeMentor,
  body('status').isIn(['EM_ANDAMENTO', 'EM_ATRASO', 'SUSPENSA', 'ATINGIDA', 'EXCLUIDA'])
    .withMessage('Status inválido')
], updateGoalStatus);

// GET /goals/mentorado/:mentorado_id
router.get('/mentorado/:mentorado_id', authenticateToken, authorizeMentor, getMentoradoGoals);

// GET /goals/my
router.get('/my', authenticateToken, authorizeMentorado, getMyGoals);

module.exports = router; 