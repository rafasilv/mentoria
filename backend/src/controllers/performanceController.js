const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');

const prisma = new PrismaClient();

const calculatePlanPerformance = async (planId, planVersionId) => {
  const planVersion = await prisma.planVersion.findUnique({
    where: { id: planVersionId }
  });

  if (!planVersion) {
    return { performance: 0, realizadas: 0, esperadas: 0 };
  }

  const realizadas = await prisma.interaction.count({
    where: {
      plan_id: planId,
      plan_version_id: planVersionId,
      status: 'REALIZADO'
    }
  });

  const performance = planVersion.interacoes_esperadas > 0 
    ? (realizadas / planVersion.interacoes_esperadas) * 100 
    : 0;

  return {
    performance: Math.round(performance * 100) / 100,
    realizadas,
    esperadas: planVersion.interacoes_esperadas
  };
};

const getPlanPerformance = async (req, res) => {
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
      },
      include: {
        versions: {
          orderBy: { created_at: 'desc' },
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
        error: 'Plano não possui versões' 
      });
    }

    const latestVersion = plan.versions[0];
    const performance = await calculatePlanPerformance(plan_id, latestVersion.id);

    res.json({
      plan_id,
      plan_version_id: latestVersion.id,
      ...performance
    });
  } catch (error) {
    console.error('Erro ao calcular performance do plano:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getGoalPerformance = async (req, res) => {
  try {
    const { goal_id } = req.params;

    // Verificar se a meta pertence ao usuário
    const goal = await prisma.goal.findFirst({
      where: {
        id: goal_id,
        OR: [
          { mentor_id: req.user.id },
          { mentorado_id: req.user.id }
        ]
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
      }
    });

    if (!goal) {
      return res.status(404).json({ 
        error: 'Meta não encontrada' 
      });
    }

    const planPerformances = [];
    let totalRealizadas = 0;
    let totalEsperadas = 0;

    for (const plan of goal.plans) {
      if (plan.versions.length > 0) {
        const performance = await calculatePlanPerformance(plan.id, plan.versions[0].id);
        planPerformances.push({
          plan_id: plan.id,
          plan_titulo: plan.titulo,
          ...performance
        });
        totalRealizadas += performance.realizadas;
        totalEsperadas += performance.esperadas;
      }
    }

    const overallPerformance = totalEsperadas > 0 
      ? (totalRealizadas / totalEsperadas) * 100 
      : 0;

    res.json({
      goal_id,
      goal_titulo: goal.titulo,
      overall_performance: Math.round(overallPerformance * 100) / 100,
      total_realizadas: totalRealizadas,
      total_esperadas: totalEsperadas,
      plans: planPerformances
    });
  } catch (error) {
    console.error('Erro ao calcular performance da meta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

const getMentoradoPerformance = async (req, res) => {
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
      }
    });

    const goalPerformances = [];
    let totalRealizadas = 0;
    let totalEsperadas = 0;

    for (const goal of goals) {
      let goalRealizadas = 0;
      let goalEsperadas = 0;

      for (const plan of goal.plans) {
        if (plan.versions.length > 0) {
          const performance = await calculatePlanPerformance(plan.id, plan.versions[0].id);
          goalRealizadas += performance.realizadas;
          goalEsperadas += performance.esperadas;
        }
      }

      const goalPerformance = goalEsperadas > 0 
        ? (goalRealizadas / goalEsperadas) * 100 
        : 0;

      goalPerformances.push({
        goal_id: goal.id,
        goal_titulo: goal.titulo,
        goal_status: goal.status,
        performance: Math.round(goalPerformance * 100) / 100,
        realizadas: goalRealizadas,
        esperadas: goalEsperadas
      });

      totalRealizadas += goalRealizadas;
      totalEsperadas += goalEsperadas;
    }

    const overallPerformance = totalEsperadas > 0 
      ? (totalRealizadas / totalEsperadas) * 100 
      : 0;

    res.json({
      mentorado_id,
      mentorado_nome: mentorado.nome,
      overall_performance: Math.round(overallPerformance * 100) / 100,
      total_realizadas: totalRealizadas,
      total_esperadas: totalEsperadas,
      goals: goalPerformances
    });
  } catch (error) {
    console.error('Erro ao calcular performance do mentorado:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  getPlanPerformance,
  getGoalPerformance,
  getMentoradoPerformance
}; 