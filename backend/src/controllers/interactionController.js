const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');

const prisma = new PrismaClient();

const createInteraction = async (req, res) => {
  try {
    const { 
      plan_id, 
      plan_version_id, 
      horario_programado, 
      status, 
      justificativa 
    } = req.body;

    // Verificar se o plano existe e pertence ao mentorado
    const plan = await prisma.plan.findFirst({
      where: {
        id: plan_id,
        goal: {
          mentorado_id: req.user.id
        }
      },
      include: {
        goal: true,
        versions: {
          where: { id: plan_version_id },
          take: 1
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ 
        error: 'Plano não encontrado' 
      });
    }

    if (plan.versions.length === 0) {
      return res.status(400).json({ 
        error: 'Versão do plano não encontrada' 
      });
    }

    const planVersion = plan.versions[0];

    // Verificar se já existe interação para este horário
    const existingInteraction = await prisma.interaction.findFirst({
      where: {
        plan_id,
        plan_version_id,
        mentorado_id: req.user.id,
        horario_programado
      }
    });

    if (existingInteraction) {
      return res.status(400).json({ 
        error: 'Já existe uma interação registrada para este horário' 
      });
    }

    // Para planos múltiplos, verificar se o horário já passou
    if (plan.tipo === 'MULTIPLA') {
      const now = moment().tz(req.user.timezone);
      const [hours, minutes] = horario_programado.split(':').map(Number);
      const scheduledTime = moment().tz(req.user.timezone).set({ hour: hours, minute: minutes });
      
      if (now.isBefore(scheduledTime)) {
        return res.status(400).json({ 
          error: 'Não é possível registrar interação antes do horário programado' 
        });
      }
    }

    // Validar status
    if (!['REALIZADO', 'NAO_REALIZADO'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido' 
      });
    }

    // Validar justificativa para não realizado
    if (status === 'NAO_REALIZADO' && !justificativa) {
      return res.status(400).json({ 
        error: 'Justificativa é obrigatória quando não realizado' 
      });
    }

    const interaction = await prisma.interaction.create({
      data: {
        plan_id,
        plan_version_id,
        mentorado_id: req.user.id,
        horario_programado,
        data_interacao: moment().toDate(),
        status,
        justificativa
      },
      include: {
        plan: {
          include: {
            goal: {
              select: {
                titulo: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(interaction);
  } catch (error) {
    console.error('Erro ao criar interação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getPlanInteractions = async (req, res) => {
  try {
    const { plan_id } = req.params;

    // Verificar se o plano pertence ao usuário
    const plan = await prisma.plan.findFirst({
      where: {
        id: plan_id,
        OR: [
          {
            goal: {
              mentor_id: req.user.id
            }
          },
          {
            goal: {
              mentorado_id: req.user.id
            }
          }
        ]
      }
    });

    if (!plan) {
      return res.status(404).json({ 
        error: 'Plano não encontrado' 
      });
    }

    const interactions = await prisma.interaction.findMany({
      where: { plan_id },
      include: {
        mentorado: {
          select: {
            id: true,
            nome: true
          }
        },
        plan_version: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(interactions);
  } catch (error) {
    console.error('Erro ao buscar interações do plano:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getMyTodayInteractions = async (req, res) => {
  try {
    const today = moment().tz(req.user.timezone).startOf('day');
    const tomorrow = moment().tz(req.user.timezone).endOf('day');

    const interactions = await prisma.interaction.findMany({
      where: {
        mentorado_id: req.user.id,
        data_interacao: {
          gte: today.toDate(),
          lte: tomorrow.toDate()
        }
      },
      include: {
        plan: {
          include: {
            goal: {
              select: {
                titulo: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(interactions);
  } catch (error) {
    console.error('Erro ao buscar minhas interações de hoje:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  createInteraction,
  getPlanInteractions,
  getMyTodayInteractions
}; 