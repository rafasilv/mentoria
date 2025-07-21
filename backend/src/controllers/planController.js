const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');

const prisma = new PrismaClient();

// Função para validar horários (múltiplos de 15 minutos)
const validateTimeSlots = (horarios) => {
  for (const horario of horarios) {
    const [hours, minutes] = horario.split(':').map(Number);
    if (minutes % 15 !== 0) {
      throw new Error(`Horário ${horario} não é múltiplo de 15 minutos`);
    }
  }
};

const createPlan = async (req, res) => {
  try {
    const { 
      goal_id, 
      tipo, 
      titulo, 
      descricao, 
      data_limite,
      dias_semana,
      horarios,
      interacoes_esperadas
    } = req.body;

    // Verificar se a meta pertence ao mentor
    const goal = await prisma.goal.findFirst({
      where: {
        id: goal_id,
        mentor_id: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ 
        error: 'Meta não encontrada' 
      });
    }

    // Validar data limite (não pode ser posterior à meta)
    const dataLimite = moment.tz(data_limite, req.user.timezone);
    const dataLimiteGoal = moment.tz(goal.data_limite, req.user.timezone);
    
    if (dataLimite.isAfter(dataLimiteGoal)) {
      return res.status(400).json({ 
        error: 'Data limite do plano não pode ser posterior à data limite da meta' 
      });
    }

    // Validar horários se for plano múltiplo
    if (tipo === 'MULTIPLA') {
      if (!dias_semana || dias_semana.length === 0) {
        return res.status(400).json({ 
          error: 'Dias da semana são obrigatórios para planos múltiplos' 
        });
      }
      if (!horarios || horarios.length === 0) {
        return res.status(400).json({ 
          error: 'Horários são obrigatórios para planos múltiplos' 
        });
      }
      
      try {
        validateTimeSlots(horarios);
      } catch (error) {
        return res.status(400).json({ 
          error: error.message 
        });
      }
    }

    // Criar plano
    const plan = await prisma.plan.create({
      data: {
        goal_id,
        tipo,
        titulo,
        descricao,
        data_limite: dataLimite.toDate()
      }
    });

    // Criar primeira versão
    const planVersion = await prisma.planVersion.create({
      data: {
        plan_id: plan.id,
        data_inicio: moment().toDate(),
        interacoes_esperadas: interacoes_esperadas || 1,
        dias_semana: dias_semana || [],
        horarios: horarios || []
      }
    });

    const planWithVersion = await prisma.plan.findUnique({
      where: { id: plan.id },
      include: {
        goal: {
          include: {
            mentorado: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        },
        versions: {
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    });

    res.status(201).json(planWithVersion);
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titulo, 
      descricao, 
      data_limite,
      dias_semana,
      horarios,
      interacoes_esperadas
    } = req.body;

    // Verificar se o plano pertence ao mentor
    const existingPlan = await prisma.plan.findFirst({
      where: {
        id,
        goal: {
          mentor_id: req.user.id
        }
      },
      include: {
        goal: true
      }
    });

    if (!existingPlan) {
      return res.status(404).json({ 
        error: 'Plano não encontrado' 
      });
    }

    // Verificar se a meta está ativa
    if (!['EM_ANDAMENTO', 'EM_ATRASO'].includes(existingPlan.goal.status)) {
      return res.status(400).json({ 
        error: 'Não é possível editar um plano de uma meta finalizada' 
      });
    }

    // Validar data limite
    if (data_limite) {
      const dataLimite = moment.tz(data_limite, req.user.timezone);
      const dataLimiteGoal = moment.tz(existingPlan.goal.data_limite, req.user.timezone);
      
      if (dataLimite.isAfter(dataLimiteGoal)) {
        return res.status(400).json({ 
          error: 'Data limite do plano não pode ser posterior à data limite da meta' 
        });
      }
    }

    // Validar horários se for plano múltiplo
    if (existingPlan.tipo === 'MULTIPLA' && horarios) {
      try {
        validateTimeSlots(horarios);
      } catch (error) {
        return res.status(400).json({ 
          error: error.message 
        });
      }
    }

    // Atualizar plano
    const updateData = {};
    if (titulo) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (data_limite) updateData.data_limite = moment.tz(data_limite, req.user.timezone).toDate();

    await prisma.plan.update({
      where: { id },
      data: updateData
    });

    // Criar nova versão
    const planVersion = await prisma.planVersion.create({
      data: {
        plan_id: id,
        data_inicio: moment().toDate(),
        interacoes_esperadas: interacoes_esperadas || 1,
        dias_semana: dias_semana || [],
        horarios: horarios || []
      }
    });

    const updatedPlan = await prisma.plan.findUnique({
      where: { id },
      include: {
        goal: {
          include: {
            mentorado: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        },
        versions: {
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    });

    res.json(updatedPlan);
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        goal: {
          include: {
            mentor: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            },
            mentorado: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        },
        versions: {
          orderBy: { created_at: 'desc' }
        },
        interactions: {
          include: {
            mentorado: {
              select: {
                id: true,
                nome: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ 
        error: 'Plano não encontrado' 
      });
    }

    res.json(plan);
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getTodayPlans = async (req, res) => {
  try {
    const today = moment().tz(req.user.timezone).format('YYYY-MM-DD');
    const dayOfWeek = moment().tz(req.user.timezone).format('ddd');

    const plans = await prisma.plan.findMany({
      where: {
        goal: {
          mentorado_id: req.user.id,
          status: {
            in: ['EM_ANDAMENTO', 'EM_ATRASO']
          }
        },
        data_limite: {
          gte: new Date()
        }
      },
      include: {
        goal: {
          select: {
            id: true,
            titulo: true,
            status: true
          }
        },
        versions: {
          orderBy: { created_at: 'desc' },
          take: 1
        },
        interactions: {
          where: {
            data_interacao: {
              gte: moment().startOf('day').toDate(),
              lte: moment().endOf('day').toDate()
            }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    // Filtrar planos que têm interações programadas para hoje
    const todayPlans = plans.filter(plan => {
      const latestVersion = plan.versions[0];
      if (!latestVersion) return false;

      if (plan.tipo === 'UNICA') {
        return moment(plan.data_limite).format('YYYY-MM-DD') === today;
      } else {
        return latestVersion.dias_semana.includes(dayOfWeek);
      }
    });

    res.json(todayPlans);
  } catch (error) {
    console.error('Erro ao buscar planos do dia:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  createPlan,
  updatePlan,
  getPlan,
  getTodayPlans
}; 