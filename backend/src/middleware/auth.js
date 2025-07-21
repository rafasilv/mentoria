const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso não fornecido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        timezone: true,
        mentor_id: true,
        notificacoes_ativas: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado' 
      });
    }
    next(error);
  }
};

const authorizeUserType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado' 
      });
    }

    if (!allowedTypes.includes(req.user.tipo_usuario)) {
      return res.status(403).json({ 
        error: 'Acesso negado para este tipo de usuário' 
      });
    }

    next();
  };
};

const authorizeMentor = authorizeUserType(['MENTOR']);
const authorizeMentorado = authorizeUserType(['MENTORADO']);
const authorizeBoth = authorizeUserType(['MENTOR', 'MENTORADO']);

module.exports = {
  authenticateToken,
  authorizeMentor,
  authorizeMentorado,
  authorizeBoth
}; 