const { PrismaClient } = require('@prisma/client');
const { processSummaryNotifications } = require('../services/cronService');

const prisma = new PrismaClient();

const testSummaryNotification = async (req, res) => {
  try {
    const { mentorado_id } = req.body;

    if (!mentorado_id) {
      return res.status(400).json({ 
        error: 'mentorado_id é obrigatório' 
      });
    }

    // Verificar se o mentorado existe
    const mentorado = await prisma.user.findFirst({
      where: {
        id: mentorado_id,
        tipo_usuario: 'MENTORADO'
      }
    });

    if (!mentorado) {
      return res.status(404).json({ 
        error: 'Mentorado não encontrado' 
      });
    }

    // Forçar processamento de notificação de resumo
    await processSummaryNotifications();

    res.json({
      notificacao_enviada: true,
      mensagem: 'Notificação de resumo processada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao testar notificação de resumo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  testSummaryNotification
}; 