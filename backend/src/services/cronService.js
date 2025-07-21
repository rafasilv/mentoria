const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const moment = require('moment-timezone');
const axios = require('axios');

const prisma = new PrismaClient();

// Função para enviar notificação via OneSignal
const sendOneSignalNotification = async (externalUserId, title, body) => {
  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        include_external_user_ids: [externalUserId],
        headings: { en: title },
        contents: { en: body },
        data: { type: 'plan_notification' }
      },
      {
        headers: {
          'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Notificação enviada para ${externalUserId}: ${title}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar notificação OneSignal:', error);
    return null;
  }
};

// Função para registrar notificação enviada
const registerNotificationSent = async (planId, planVersionId, mentoradoId, data, horario) => {
  try {
    await prisma.notificationSent.create({
      data: {
        plan_id: planId,
        plan_version_id: planVersionId,
        mentorado_id: mentoradoId,
        data: new Date(data),
        horario
      }
    });
  } catch (error) {
    console.error('Erro ao registrar notificação enviada:', error);
  }
};

// Função para verificar se já foi notificado hoje
const wasNotifiedToday = async (planId, mentoradoId, data, horario) => {
  const notification = await prisma.notificationSent.findFirst({
    where: {
      plan_id: planId,
      mentorado_id: mentoradoId,
      data: new Date(data),
      horario
    }
  });
  return !!notification;
};

// Função para verificar se já interagiu hoje
const hasInteractedToday = async (planId, planVersionId, mentoradoId, horario) => {
  const interaction = await prisma.interaction.findFirst({
    where: {
      plan_id: planId,
      plan_version_id: planVersionId,
      mentorado_id: mentoradoId,
      horario_programado: horario,
      data_interacao: {
        gte: moment().startOf('day').toDate(),
        lte: moment().endOf('day').toDate()
      }
    }
  });
  return !!interaction;
};

// Função principal do cron job
const processNotifications = async () => {
  try {
    const now = moment();
    const currentTime = now.format('HH:mm');
    const currentDay = now.format('ddd');
    const today = now.format('YYYY-MM-DD');

    console.log(`🕒 Processando notificações - ${currentTime} ${currentDay}`);

    // Buscar todos os planos ativos
    const activePlans = await prisma.plan.findMany({
      where: {
        goal: {
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
          include: {
            mentorado: {
              select: {
                id: true,
                nome: true,
                notificacoes_ativas: true
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

    for (const plan of activePlans) {
      if (plan.versions.length === 0) continue;

      const latestVersion = plan.versions[0];
      const mentorado = plan.goal.mentorado;

      // Verificar se o mentorado tem notificações ativas
      if (!mentorado.notificacoes_ativas) continue;

      // Para planos únicos
      if (plan.tipo === 'UNICA') {
        const planDate = moment(plan.data_limite).format('YYYY-MM-DD');
        
        // Notificar no momento da criação (se for hoje)
        if (planDate === today) {
          for (const horario of latestVersion.horarios) {
            if (horario === currentTime) {
              // Verificar se já foi notificado
              if (await wasNotifiedToday(plan.id, mentorado.id, today, horario)) {
                continue;
              }

              // Verificar se já interagiu
              if (await hasInteractedToday(plan.id, latestVersion.id, mentorado.id, horario)) {
                continue;
              }

              // Enviar notificação
              await sendOneSignalNotification(
                mentorado.id,
                `Plano: ${plan.titulo}`,
                `Você tem um plano programado para ${horario}. Não esqueça de realizá-lo!`
              );

              // Registrar notificação enviada
              await registerNotificationSent(plan.id, latestVersion.id, mentorado.id, today, horario);
            }
          }
        }
      }
      // Para planos múltiplos
      else if (plan.tipo === 'MULTIPLA') {
        if (latestVersion.dias_semana.includes(currentDay)) {
          for (const horario of latestVersion.horarios) {
            if (horario === currentTime) {
              // Verificar se já foi notificado
              if (await wasNotifiedToday(plan.id, mentorado.id, today, horario)) {
                continue;
              }

              // Verificar se já interagiu
              if (await hasInteractedToday(plan.id, latestVersion.id, mentorado.id, horario)) {
                continue;
              }

              // Enviar notificação
              await sendOneSignalNotification(
                mentorado.id,
                `Plano: ${plan.titulo}`,
                `É hora do seu plano programado para ${horario}. Que tal realizá-lo agora?`
              );

              // Registrar notificação enviada
              await registerNotificationSent(plan.id, latestVersion.id, mentorado.id, today, horario);
            }
          }
        }
      }
    }

    // Processar notificações de resumo (pendências acumuladas)
    await processSummaryNotifications();

  } catch (error) {
    console.error('Erro no processamento de notificações:', error);
  }
};

// Função para processar notificações de resumo
const processSummaryNotifications = async () => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const currentDay = moment().format('ddd');

    // Buscar todos os mentorados com notificações ativas
    const mentorados = await prisma.user.findMany({
      where: {
        tipo_usuario: 'MENTORADO',
        notificacoes_ativas: true
      }
    });

    for (const mentorado of mentorados) {
      // Verificar se já enviou resumo hoje
      const summarySent = await prisma.notificationSummarySent.findFirst({
        where: {
          mentorado_id: mentorado.id,
          data: new Date(today)
        }
      });

      if (summarySent) continue;

      // Contar pendências do dia
      let pendingCount = 0;

      const activePlans = await prisma.plan.findMany({
        where: {
          goal: {
            mentorado_id: mentorado.id,
            status: {
              in: ['EM_ANDAMENTO', 'EM_ATRASO']
            }
          },
          data_limite: {
            gte: new Date()
          }
        },
        include: {
          versions: {
            orderBy: { created_at: 'desc' },
            take: 1
          }
        }
      });

      for (const plan of activePlans) {
        if (plan.versions.length === 0) continue;

        const latestVersion = plan.versions[0];

        if (plan.tipo === 'UNICA') {
          const planDate = moment(plan.data_limite).format('YYYY-MM-DD');
          if (planDate === today) {
            for (const horario of latestVersion.horarios) {
              const wasNotified = await wasNotifiedToday(plan.id, mentorado.id, today, horario);
              const hasInteracted = await hasInteractedToday(plan.id, latestVersion.id, mentorado.id, horario);
              
              if (!wasNotified && !hasInteracted) {
                pendingCount++;
              }
            }
          }
        } else if (plan.tipo === 'MULTIPLA') {
          if (latestVersion.dias_semana.includes(currentDay)) {
            for (const horario of latestVersion.horarios) {
              const wasNotified = await wasNotifiedToday(plan.id, mentorado.id, today, horario);
              const hasInteracted = await hasInteractedToday(plan.id, latestVersion.id, mentorado.id, horario);
              
              if (!wasNotified && !hasInteracted) {
                pendingCount++;
              }
            }
          }
        }
      }

      // Se há pendências, enviar notificação de resumo
      if (pendingCount >= 2) {
        await sendOneSignalNotification(
          mentorado.id,
          'Planos pendentes',
          `Você tem ${pendingCount} planos pendentes de hoje. Que tal atualizá-los agora?`
        );

        // Registrar resumo enviado
        await prisma.notificationSummarySent.create({
          data: {
            mentorado_id: mentorado.id,
            data: new Date(today)
          }
        });
      }
    }
  } catch (error) {
    console.error('Erro ao processar notificações de resumo:', error);
  }
};

// Iniciar cron jobs
const startCronJobs = () => {
  // Cron job para notificações a cada 15 minutos
  cron.schedule('*/15 * * * *', processNotifications, {
    scheduled: true,
    timezone: process.env.DEFAULT_TIMEZONE || 'America/Sao_Paulo'
  });

  console.log('⏰ Cron jobs iniciados');
};

module.exports = {
  startCronJobs,
  processNotifications,
  processSummaryNotifications
}; 