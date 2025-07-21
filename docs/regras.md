# 📏 Documento Oficial de Regras do Projeto de Mentoria

Este documento serve como guia para evitar alucinações durante o desenvolvimento e garantir que todas as decisões técnicas e regras de negócio sejam respeitadas no código, nos endpoints e nas interfaces.

---

## ⚙️ Tecnologias e Estrutura Obrigatória

### Mobile App
- **React Native com Expo**
- **EAS Build** para builds de produção
- **NativeWind (Tailwind)** para estilização
- Armazenamento seguro com `expo-secure-store`
- Biometria com `expo-local-authentication`
- Notificações com **OneSignal SDK + REST API**

### Backend
- **Node.js com Express**
- Banco de dados: **PostgreSQL**
- Cache/agendamento: **Redis**
- ORM: **Prisma**
- Gerenciamento de autenticação: **JWT**
- Backend roda em container via Docker

### Containers
- Banco e Redis devem rodar via `docker-compose`
- Arquivo `.env` deve seguir padrão de `.env.example`

---

## 🔄 Regras de Negócio Fundamentais

### Usuários
- Dois tipos: **mentor** e **mentorado**
- O mentor pode ter múltiplos mentorados
- Toda rota deve verificar o tipo de usuário logado (autorização)

### Metas
- Criadas apenas pelo mentor
- Possuem status: `em andamento`, `atrasada`, `atingida`, `suspensa`, `excluída`
- Possuem data limite obrigatória
- Podem ser editadas enquanto ativas

### Planos
- Ligados a metas
- Tipos:
  - `interação única` (1x até uma data específica)
  - `interação múltipla` (X vezes por semana até uma data)
- Toda edição cria uma nova versão do plano (`plan_versions`)
- **Todos os horários definidos devem ser múltiplos de 15 minutos**

### Interações
- Realizadas pelo mentorado após o horário agendado
- Estados possíveis:
  - `realizado`
  - `não realizado` (com justificativa opcional)
- Usadas para cálculo de performance e para limitar reenvio de notificação

### Performance
- Calculada com base em interações **realizadas** por plano
- Sempre considera a versão vigente no momento da execução
- Performance deve ser calculada por:
  - Plano
  - Meta
  - Mentorado

---

## 🔔 Notificações

### Motor de notificações
- Cron job roda **a cada 15 minutos**
- Só processa planos com `horario_programado === horário atual`
- Não há tolerância ou arredondamento

### Notificações são enviadas:
- No momento da criação do plano (interação única)
- No momento do horário programado (todos os planos)
- Uma vez por dia, se houver pendências acumuladas

### Controle de reenvio
- Tabela `notifications_sent` para evitar notificação duplicada
- Tabela `notifications_summary_sent` para notificação de pendência acumulada

---

## 🧪 Regras de Interface (App)

- Biometria é obrigatória se disponível no device
- O mentorado só vê planos cujos horários já passaram
- O mentorado pode marcar múltiplas interações pendentes de uma vez
- Campos de horário no app devem seguir step de 15 minutos

---

## ❗ Proibições

- 🚫 Não criar horários fora dos múltiplos de 15min
- 🚫 Não criar notificações fora do horário do cron
- 🚫 Não permitir interação futura
- 🚫 Não ignorar a versão de plano ao calcular performance