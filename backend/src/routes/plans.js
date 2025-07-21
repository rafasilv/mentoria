const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorizeMentor, authorizeMentorado } = require('../middleware/auth');
const { 
  createPlan, 
  updatePlan, 
  getPlan, 
  getTodayPlans 
} = require('../controllers/planController');

const router = express.Router();

// POST /plans
router.post('/', [
  authenticateToken,
  authorizeMentor,
  body('goal_id').notEmpty().withMessage('ID da meta é obrigatório'),
  body('tipo').isIn(['UNICA', 'MULTIPLA']).withMessage('Tipo inválido'),
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('data_limite').isISO8601().withMessage('Data limite inválida'),
  body('interacoes_esperadas').optional().isInt({ min: 1 }).withMessage('Interações esperadas deve ser um número positivo')
], createPlan);

// PUT /plans/:id
router.put('/:id', [
  authenticateToken,
  authorizeMentor,
  body('titulo').optional().notEmpty().withMessage('Título não pode ser vazio'),
  body('data_limite').optional().isISO8601().withMessage('Data limite inválida'),
  body('interacoes_esperadas').optional().isInt({ min: 1 }).withMessage('Interações esperadas deve ser um número positivo')
], updatePlan);

// GET /plans/:id
router.get('/:id', authenticateToken, getPlan);

// GET /plans/today
router.get('/today', authenticateToken, authorizeMentorado, getTodayPlans);

module.exports = router; 