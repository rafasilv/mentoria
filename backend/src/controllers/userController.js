const { PrismaClient } = require('@prisma/client');

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

module.exports = {
  getMe,
  getMentorados,
  getMentor
}; 