# ✅ Lista Detalhada de Tarefas com Dependência para Construção da Aplicação de Mentoria

---

## 1. 🏗 Ambiente e Estrutura Inicial

- [ ] Criar repositório com monorepo (backend/ e app/)
- [ ] Criar `docker-compose.yml` com serviços:
  - `postgres` (porta 5432)
  - `redis` (porta 6379)
- [ ] Criar `.env.example` com variáveis:
  - `DATABASE_URL`, `JWT_SECRET`, `ONESIGNAL_API_KEY`, etc.
- [ ] Subir containers com `docker-compose up -d`
- [ ] Criar estrutura inicial do backend:
  - `npm init -y`
  - Instalar dependências básicas: `express`, `cors`, `dotenv`, `prisma`, `pg`
- [ ] Criar estrutura inicial do app Expo:
  - `npx create-expo-app app`
  - Instalar dependências básicas: `react-navigation`, `axios`, `expo-local-authentication`, `expo-secure-store`, `react-native-onesignal`

---

## 2. 🎨 App Expo: Tailwind + Tema

- [ ] Instalar Tailwind com NativeWind:
  - `npm install nativewind`
  - Criar `tailwind.config.js` com tema personalizado
  - Adicionar preset e plugin no `babel.config.js`
- [ ] Criar pasta `components/ui/` com estilos baseados em Tailwind
- [ ] Criar tema global (fontes, cores, espaçamento padrão)

---

## 3. 🧱 Backend: Modelagem de Dados

- [ ] Inicializar Prisma (`npx prisma init`)
- [ ] Criar schema com modelos:
  - `users`, `goals`, `plans`, `plan_versions`, `interactions`
  - `notifications_sent`, `notifications_summary_sent`
- [ ] Executar `prisma migrate dev` para criar o banco

---

## 4. 🔐 Autenticação

- [ ] Instalar dependências: `jsonwebtoken`, `bcryptjs`, `cookie-parser`
- [ ] Criar endpoints:
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/onesignal`
- [ ] Criar middleware de autenticação e autorização por perfil
- [ ] Validar sessão via JWT e proteger rotas

---

## 5. 👥 Usuários e Relacionamento

- [ ] Criar relacionamento mentor ↔ mentorado
- [ ] Endpoints:
  - `GET /me`
  - `GET /mentor`
  - `GET /mentorados`

---

## 6. 🎯 Metas

- [ ] Criar endpoints:
  - `POST /goals`
  - `PUT /goals/:id`
  - `PATCH /goals/:id/status`
  - `GET /mentorados/:id/goals`
- [ ] Validar `data_limite`
- [ ] Implementar soft delete se necessário

---

## 7. 🧩 Planos e Versões

- [ ] Criar lógica de plano com versão e tipo
- [ ] Validar:
  - `dias_semana`, `horarios` (múltiplos de 15 min)
  - `data_programada` (plano único)
  - `data_limite` da meta
- [ ] Endpoints:
  - `POST /plans`
  - `PUT /plans/:id` (cria nova versão)
  - `GET /plans/:id`
  - `GET /plans/:id/versions`

---

## 8. 🧠 Interações

- [ ] Criar endpoint `POST /interactions` com status (realizado/não) e justificativa
- [ ] `GET /plans/:id/interactions`
- [ ] `GET /me/interactions/today`
- [ ] Usar `horario_programado` no controle e performance

---

## 9. 📊 Performance

- [ ] Calcular % com base em interações realizadas vs esperadas por versão
- [ ] Endpoints:
  - `GET /plans/:id/performance`
  - `GET /goals/:id/performance`
  - `GET /mentorados/:id/performance`

---

## 10. 🔔 Notificações

- [ ] Integrar OneSignal REST e SDK
- [ ] Criar tabelas de controle: `notifications_sent`, `notifications_summary_sent`
- [ ] Criar cron job:
  - Executa a cada 15 min
  - Notifica planos com `horario_programado == now()`
  - Usa Redis para agendamento ou fallback
- [ ] Endpoint: `POST /notifications/test-summary`
- [ ] Notificar:
  - No momento da criação (planos únicos)
  - No horário exato de execução
  - Notificação consolidada se múltiplas pendências

---

## 11. 📱 App: Navegação e Contexto

- [ ] Configurar `React Navigation` com Auth Stack
- [ ] Criar contexto global de autenticação
- [ ] Armazenar token com `expo-secure-store`
- [ ] Integrar login com biometria (`expo-local-authentication`)

---

## 12. 📲 App: Telas do Mentorado

- [ ] Login + validação biométrica
- [ ] Dashboard de metas (ativas/atrasadas)
- [ ] Tela de planos do dia
- [ ] Interação: marcar como Realizado / Não Realizado + justificativa
- [ ] Tela de progresso/performance

---

## 13. 🧑‍🏫 App: Telas do Mentor

- [ ] Dashboard com lista de mentorados
- [ ] Tela de metas do mentorado
- [ ] Criação/edição de meta
- [ ] Tela de planos da meta
- [ ] Criação/edição de plano
- [ ] Tela de performance consolidada

---

## 14. 🧪 Extras

- [ ] Criar rota `/healthcheck`
- [ ] Criar `seed.ts` com usuários/metas/planos para testes locais
- [ ] Criar script de testes unitários iniciais
- [ ] Deploy do backend (Railway ou VPS)
- [ ] Build do app via EAS para Android/iOS