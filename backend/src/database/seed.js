const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Limpar dados existentes
    await prisma.notificationSummarySent.deleteMany();
    await prisma.notificationSent.deleteMany();
    await prisma.interaction.deleteMany();
    await prisma.planVersion.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️ Dados anteriores removidos');

    // Criar mentor
    const mentor = await prisma.user.create({
      data: {
        nome: 'João Silva',
        email: 'joao@mentoria.com',
        senha_hash: await bcrypt.hash('123456', 10),
        tipo_usuario: 'MENTOR',
        timezone: 'America/Sao_Paulo'
      }
    });

    console.log('👨‍🏫 Mentor criado:', mentor.nome);

    // Criar mentorados
    const mentorado1 = await prisma.user.create({
      data: {
        nome: 'Maria Santos',
        email: 'maria@mentoria.com',
        senha_hash: await bcrypt.hash('123456', 10),
        tipo_usuario: 'MENTORADO',
        mentor_id: mentor.id,
        timezone: 'America/Sao_Paulo'
      }
    });

    const mentorado2 = await prisma.user.create({
      data: {
        nome: 'Pedro Costa',
        email: 'pedro@mentoria.com',
        senha_hash: await bcrypt.hash('123456', 10),
        tipo_usuario: 'MENTORADO',
        mentor_id: mentor.id,
        timezone: 'America/Sao_Paulo'
      }
    });

    console.log('👥 Mentorados criados:', mentorado1.nome, 'e', mentorado2.nome);

    // Criar metas
    const meta1 = await prisma.goal.create({
      data: {
        mentor_id: mentor.id,
        mentorado_id: mentorado1.id,
        titulo: 'Estudar React Native',
        descricao: 'Aprender os fundamentos do React Native para desenvolvimento mobile',
        data_limite: new Date('2024-02-29'),
        status: 'EM_ANDAMENTO'
      }
    });

    const meta2 = await prisma.goal.create({
      data: {
        mentor_id: mentor.id,
        mentorado_id: mentorado1.id,
        titulo: 'Praticar Exercícios',
        descricao: 'Manter rotina de exercícios físicos',
        data_limite: new Date('2024-03-15'),
        status: 'EM_ANDAMENTO'
      }
    });

    const meta3 = await prisma.goal.create({
      data: {
        mentor_id: mentor.id,
        mentorado_id: mentorado2.id,
        titulo: 'Ler Livros',
        descricao: 'Ler pelo menos 30 minutos por dia',
        data_limite: new Date('2024-03-31'),
        status: 'EM_ANDAMENTO'
      }
    });

    console.log('🎯 Metas criadas');

    // Criar planos
    const plano1 = await prisma.plan.create({
      data: {
        goal_id: meta1.id,
        tipo: 'MULTIPLA',
        titulo: 'Estudar React Native',
        descricao: 'Dedicar 1 hora por dia ao estudo',
        data_limite: new Date('2024-02-29')
      }
    });

    const plano2 = await prisma.plan.create({
      data: {
        goal_id: meta2.id,
        tipo: 'MULTIPLA',
        titulo: 'Exercícios Matinais',
        descricao: 'Fazer exercícios às 7h da manhã',
        data_limite: new Date('2024-03-15')
      }
    });

    const plano3 = await prisma.plan.create({
      data: {
        goal_id: meta3.id,
        tipo: 'UNICA',
        titulo: 'Ler Capítulo 5',
        descricao: 'Ler o capítulo 5 do livro atual',
        data_limite: new Date('2024-02-20')
      }
    });

    console.log('📝 Planos criados');

    // Criar versões dos planos
    const versao1 = await prisma.planVersion.create({
      data: {
        plan_id: plano1.id,
        data_inicio: new Date('2024-02-01'),
        interacoes_esperadas: 20,
        dias_semana: ['Mon', 'Wed', 'Fri'],
        horarios: ['08:00', '14:00']
      }
    });

    const versao2 = await prisma.planVersion.create({
      data: {
        plan_id: plano2.id,
        data_inicio: new Date('2024-02-01'),
        interacoes_esperadas: 30,
        dias_semana: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        horarios: ['07:00']
      }
    });

    const versao3 = await prisma.planVersion.create({
      data: {
        plan_id: plano3.id,
        data_inicio: new Date('2024-02-01'),
        interacoes_esperadas: 1,
        dias_semana: [],
        horarios: ['18:00']
      }
    });

    console.log('📋 Versões dos planos criadas');

    // Criar algumas interações de exemplo
    const interacao1 = await prisma.interaction.create({
      data: {
        plan_id: plano1.id,
        plan_version_id: versao1.id,
        mentorado_id: mentorado1.id,
        horario_programado: '08:00',
        data_interacao: new Date('2024-02-05'),
        status: 'REALIZADO'
      }
    });

    const interacao2 = await prisma.interaction.create({
      data: {
        plan_id: plano1.id,
        plan_version_id: versao1.id,
        mentorado_id: mentorado1.id,
        horario_programado: '14:00',
        data_interacao: new Date('2024-02-05'),
        status: 'NAO_REALIZADO',
        justificativa: 'Tive uma reunião importante'
      }
    });

    const interacao3 = await prisma.interaction.create({
      data: {
        plan_id: plano2.id,
        plan_version_id: versao2.id,
        mentorado_id: mentorado1.id,
        horario_programado: '07:00',
        data_interacao: new Date('2024-02-06'),
        status: 'REALIZADO'
      }
    });

    console.log('✅ Interações de exemplo criadas');

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Dados criados:');
    console.log('- 1 Mentor');
    console.log('- 2 Mentorados');
    console.log('- 3 Metas');
    console.log('- 3 Planos');
    console.log('- 3 Versões de planos');
    console.log('- 3 Interações de exemplo');
    console.log('\n🔑 Credenciais de teste:');
    console.log('Mentor: joao@mentoria.com / 123456');
    console.log('Mentorado 1: maria@mentoria.com / 123456');
    console.log('Mentorado 2: pedro@mentoria.com / 123456');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed(); 