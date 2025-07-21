const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');

const prisma = new PrismaClient();

const createGoal = async (req, res) => {
  try {
    const { mentorado_id, titulo, descricao, data_limite } = req.body;

    // Validar se o mentorado pertence ao mentor
    const mentorado = await prisma.user.findFirst({
      where: {
        id: mentorado_id,
        mentor_id: req.user.id,
        tipo_usuario: 'MENTORADO'
      }
    });

    if (!mentorado) {
      return res.status(404).json({ 
        error: 'Mentorado não encontrado ou não pertence a este mentor' 
      });
    }

    // Validar data limite
    const dataLimite = moment.tz(data_limite, req.user.timezone);
    if (dataLimite.isBefore(moment(), 'day')) {
      return res.status(400).json({ 
        error: 'Data limite não pode ser anterior a hoje' 
      });
    }

    const goal = await prisma.goal.create({
      data: {
        mentor_id: req.user.id,
        mentorado_id,
        titulo,
        descricao,
        data_limite: dataLimite.toDate(),
        status: 'EM_ANDAMENTO'
      },
      include: {
        mentorado: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, data_limite } = req.body;

    // Verificar se a meta pertence ao mentor
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        mentor_id: req.user.id
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ 
        error: 'Meta não encontrada' 
      });
    }

    // Só permite edição se estiver ativa
    if (!['EM_ANDAMENTO', 'EM_ATRASO'].includes(existingGoal.status)) {
      return res.status(400).json({ 
        error: 'Não é possível editar uma meta finalizada' 
      });
    }

    const updateData = {};
    if (titulo) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (data_limite) {
      const dataLimite = moment.tz(data_limite, req.user.timezone);
      if (dataLimite.isBefore(moment(), 'day')) {
        return res.status(400).json({ 
          error: 'Data limite não pode ser anterior a hoje' 
        });
      }
      updateData.data_limite = dataLimite.toDate();
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
      include: {
        mentorado: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.json(goal);
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const updateGoalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['EM_ANDAMENTO', 'EM_ATRASO', 'SUSPENSA', 'ATINGIDA', 'EXCLUIDA'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido' 
      });
    }

    // Verificar se a meta pertence ao mentor
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        mentor_id: req.user.id
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ 
        error: 'Meta não encontrada' 
      });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: { status },
      include: {
        mentorado: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.json(goal);
  } catch (error) {
    console.error('Erro ao atualizar status da meta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getMentoradoGoals = async (req, res) => {
  try {
    const { mentorado_id } = req.params;

    // Verificar se o mentorado pertence ao mentor
    const mentorado = await prisma.user.findFirst({
      where: {
        id: mentorado_id,
        mentor_id: req.user.id,
        tipo_usuario: 'MENTORADO'
      }
    });

    if (!mentorado) {
      return res.status(404).json({ 
        error: 'Mentorado não encontrado' 
      });
    }

    const goals = await prisma.goal.findMany({
      where: {
        mentorado_id,
        mentor_id: req.user.id
      },
      include: {
        plans: {
          include: {
            versions: {
              orderBy: { created_at: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(goals);
  } catch (error) {
    console.error('Erro ao buscar metas do mentorado:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getMyGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        mentorado_id: req.user.id
      },
      include: {
        mentor: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        plans: {
          include: {
            versions: {
              orderBy: { created_at: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(goals);
  } catch (error) {
    console.error('Erro ao buscar minhas metas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  createGoal,
  updateGoal,
  updateGoalStatus,
  getMentoradoGoals,
  getMyGoals
}; 