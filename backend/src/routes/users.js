const express = require('express');
const { authenticateToken, authorizeMentor, authorizeMentorado } = require('../middleware/auth');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuração do multer para salvar imagens em /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// GET /users/me
router.get('/me', authenticateToken, userController.getMe);

// GET /users/mentorados
router.get('/mentorados', authenticateToken, authorizeMentor, userController.getMentorados);

// GET /users/mentor
router.get('/mentor', authenticateToken, authorizeMentorado, userController.getMentor);

// Atualizar perfil do usuário logado (nome e foto)
router.put('/me', authenticateToken, upload.single('foto'), userController.updateProfile);

// Trocar senha do usuário logado
router.put('/me/password', authenticateToken, userController.changePassword);

module.exports = router; 