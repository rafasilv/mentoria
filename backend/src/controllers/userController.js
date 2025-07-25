const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        timezone: true,
        mentor_id: true,
        notificacoes_ativas: true,
        created_at: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getMentorados = async (req, res) => {
  try {
    const mentorados = await prisma.user.findMany({
      where: { 
        mentor_id: req.user.id,
        tipo_usuario: 'MENTORADO'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        timezone: true,
        notificacoes_ativas: true,
        created_at: true,
        _count: {
          select: {
            goals_assigned: true
          }
        }
      }
    });

    res.json(mentorados);
  } catch (error) {
    console.error('Erro ao buscar mentorados:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getMentor = async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'MENTORADO') {
      return res.status(403).json({ 
        error: 'Apenas mentorados podem acessar informações do mentor' 
      });
    }

    const mentor = await prisma.user.findUnique({
      where: { id: req.user.mentor_id },
      select: {
        id: true,
        nome: true,
        email: true,
        timezone: true
      }
    });

    if (!mentor) {
      return res.status(404).json({ 
        error: 'Mentor não encontrado' 
      });
    }

    res.json(mentor);
  } catch (error) {
    console.error('Erro ao buscar mentor:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const { nome } = req.body;
    let fotoUrl = undefined;
    if (req.file) {
      // Caminho relativo para servir a imagem depois
      fotoUrl = `/uploads/${req.file.filename}`;
    }
    const dataToUpdate = { nome };
    if (fotoUrl) dataToUpdate.foto = fotoUrl;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        foto: true
      }
    });
    console.log('Usuário atualizado:', user);
    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const senhaCorreta = await bcrypt.compare(senhaAtual, user.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { senha_hash: novaSenhaHash }
    });
    res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  getMe,
  getMentorados,
  getMentor,
  updateProfile,
  changePassword
}; 