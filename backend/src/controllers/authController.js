const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }

    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas' 
      });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        tipo: user.tipo_usuario 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    const { senha_hash, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const logout = async (req, res) => {
  try {
    // Marcar notificações como inativas
    await prisma.user.update({
      where: { id: req.user.id },
      data: { notificacoes_ativas: false }
    });

    res.json({ 
      message: 'Logout realizado com sucesso' 
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const registerOneSignal = async (req, res) => {
  try {
    const { external_user_id } = req.body;

    if (!external_user_id) {
      return res.status(400).json({ 
        error: 'external_user_id é obrigatório' 
      });
    }

    // Aqui você pode salvar o external_user_id se necessário
    // Por enquanto, apenas retornamos sucesso
    res.json({ 
      message: 'OneSignal registrado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao registrar OneSignal:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  login,
  logout,
  registerOneSignal
}; 