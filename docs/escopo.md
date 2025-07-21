# 📘 Escopo Funcional e Roteiro Técnico — Sistema de Mentoria



---

## 📐 Regras de Negócio Consolidadas

### 🧑‍🏫 Usuários
- Existem dois tipos: **mentor** e **mentorado**
- O mentor pode ter múltiplos mentorados
- Todas as rotas protegidas devem validar o tipo de usuário

### 🎯 Metas
- Criadas pelo mentor
- Possuem uma data limite obrigatória
- Status possíveis:
  - `em andamento`: dentro do prazo
  - `atrasada`: ultrapassou o prazo
  - `atingida`, `suspensa`, `excluída`: definidos manualmente pelo mentor
- Podem ser editadas enquanto estiverem ativas

### 🧩 Planos
- Ligados a metas e criados pelo mentor
- Tipos:
  - **Interação única**: 1 vez até uma data e horário
  - **Interação múltipla**: X vezes em horários e dias distintos de uma semana (ex: 8h e 18h de segunda e quarta), ou frequências personalizadas (ex: segunda a cada 15 dias, terça uma vez por mês), até a data limite.
- Sempre que editado, gera uma nova versão (`plan_versions`)
- Cada versão tem:
  - Data de início
  - Data limite (igual ou antes da meta)
  - Lista de dias da semana e horários (no caso de múltiplos)
- **Todos os horários devem ser múltiplos de 15 minutos**

### 🧠 Interações
- Para planos múltiplos, só podem ser registradas **após o horário programado**;
- Para planos de interação única, a interação **pode ser feita antes** do horário/data programados
- O mentorado pode:
  - Marcar como **realizado**
  - Marcar como **não realizado** com justificativa
- Um plano pode acumular interações pendentes

### 📊 Performance
- Calculada por versão de plano
- Fórmula: (interações realizadas) / (interações esperadas)
- Performance por:
  - Plano
  - Meta (média ponderada dos planos)
  - Mentorado (resumo geral)
- **A performance é apenas um indicativo — o mentor decide se a meta foi atingida**


### 🔔 Notificações (regras atualizadas)

- Enviadas para o mentorado:
  1. No momento da criação de um plano de interação única
  2. No horário programado da data programada do plano de interação única
  3. A cada horário definido nos planos de interação múltipla, conforme a programação semanal

- Disparadas pelo cron a cada 15 min
- Restrições:
  - Notifica apenas se `horario_programado == horário atual do cron`
  - Apenas se o usuário tiver `notificacoes_ativas`
  - Nunca notifica o mesmo plano duas vezes no mesmo horário

### 1.1 Mentor
- Cria metas para cada mentorado
- Define planos dentro de metas
- Edita metas e planos enquanto ativos
- Acompanha performance individual e geral
- Define o desfecho final de uma meta (atingida, suspensa, excluída)

### 1.2 Mentorado
- Visualiza metas e planos atribuídos a ele
- Recebe notificações
- Realiza interações conforme os planos
- Registra se **realizou ou não** o plano
  - Se não realizou, pode incluir **justificativa**
---
## 2. 🎯 Metas

### 2.1 Atributos
- Título
- Descrição
- Data limite
- Status (calculado + manual):
  - `em_andamento`
  - `em_atraso`
  - `suspensa`
  - `atingida`
  - `excluída`

### 2.2 Regras
- Uma meta pode ser editada se estiver ativa
- Cada meta pertence a um único mentorado
- Uma meta contém um ou mais planos
- A data limite da meta delimita o prazo final para execução de seus planos
---
## 3. 📝 Planos

### 3.1 Tipos
- **Interação única**:
  - Data específica para realização
  - Apenas uma oportunidade de interação

- **Múltiplas interações**:
  - X interações programadas até data limite
  - Cada interação tem **dia da semana** e **horário fixo**

### 3.2 Campos
- Título
- Descrição
- Tipo (`única` | `múltipla`)
- Data limite (≤ meta)
- Número de interações esperadas
- Lista de horários/dias fixos (para múltiplas interações)

### 3.3 Regras
- Planos podem ser editados enquanto a meta estiver ativa
- Performance é calculada com base nas configurações vigentes no momento da execução
- Planos devem ter dias e horários fixos
---
## 4. 🧠 Interações

- Realizadas apenas após o horário programado
- Mentorado deve escolher:
  - "Realizado" → conta para performance
  - "Não realizado" → não conta, mas pode incluir justificativa
- Interações únicas podem ser feitas antes da data limite
- Múltiplas interações só após o horário definido
- Sem penalização por atraso
---
## 5. 📈 Performance

```txt
performance (%) = (interações realizadas / interações esperadas) * 100
```

- Calculada por plano e consolidada por meta
- Visível para mentor por mentorado e geral
- Considera apenas interações marcadas como "Realizado"
---
## 10. 🔁 Relacionamentos

- Um mentor pode ter vários mentorados
- Cada mentorado tem apenas um mentor
- Uma meta → vários planos → várias interações
---
## 8. 🌍 Fuso Horário

- Armazenamento e exibição de datas no timezone do usuário
- Aplicado a metas, planos, interações e notificações
---
## 6. 🔔 Notificações (OneSignal)

- Notificações por:
  - Nova meta ou plano
  - Horário de plano programado
  - Meta suspensa ou excluída
  - Último dia da meta
- Envio via backend usando `external_user_id`
- Baseadas no timezone do usuário
---
ts
// Após processar planos individualmente, checar acumulados por mentorado
for (const mentorado of mentorados) {
  const pendenciasHoje = db.plan_versions
    .filter(pv => hojeÉDia(pv.dias_semana))
    .flatMap(pv => pv.horarios)
    .filter(horario => horario < agora())
    .filter(horario => !interagiuHoje(mentorado.id, horario))

  const totalPendentes = pendenciasHoje.length

  if (totalPendentes >= 2 && !jaEnviouResumoHoje(mentorado.id)) {
    sendPush({
      userId: mentorado.id,
      title: "Planos pendentes",
      body: `Você tem ${totalPendentes} planos pendentes de hoje. Que tal atualizá-los agora?`
    })

    registrarResumoNotificacao(mentorado.id, today)
  }
}
```

- A verificação de `jaEnviouResumoHoje` pode ser baseada em uma flag na tabela `notifications_sent`, tipo `"resumo_diario"` por usuário e data.
---
## 🔘 Endpoint REST: Forçar envio de resumo de planos pendentes

### `POST /notifications/test-summary`

Este endpoint é usado apenas para testes e debug. Força o envio da notificação de resumo de planos pendentes para um mentorado, mesmo que ela já tenha sido enviada.

### Corpo da requisição (JSON):
```json
{
  "mentorado_id": "uuid"
}
```

### Regras:
- Ignora a tabela `notifications_summary_sent`
- Busca todas as interações pendentes expiradas do dia
- Se houver 1 ou mais, envia notificação de resumo
- Ideal para debug em ambiente de staging ou sandbox

### Exemplo de resposta:
```json
{
  "notificacao_enviada": true,
  "quantidade_pendencias": 3
}
```

**Observação:** Esse endpoint não deve ser exposto em produção.
---
## 📦 Banco de Dados — Estrutura Detalhada


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  tipo_usuario TEXT CHECK (tipo_usuario IN ('mentor', 'mentorado')) NOT NULL,
  timezone TEXT NOT NULL,
  mentor_id UUID REFERENCES users(id),
  notificacoes_ativas BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  tipo_usuario TEXT CHECK (tipo_usuario IN ('mentor', 'mentorado')) NOT NULL,
  timezone TEXT NOT NULL,
  mentor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);
```

### 🎯 goals
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES users(id),
  mentorado_id UUID REFERENCES users(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_limite DATE NOT NULL,
  status TEXT CHECK (
    status IN ('em_andamento', 'em_atraso', 'suspensa', 'atingida', 'excluida')
  ) DEFAULT 'em_andamento',
  created_at TIMESTAMP DEFAULT now()
);
```

### 🧩 plans
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('unica', 'multipla')) NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_limite DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 📄 plan_versions
```sql
CREATE TABLE plan_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  interacoes_esperadas INT NOT NULL,
  dias_semana TEXT[] DEFAULT '{}',
  horarios TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now()
);
```

### 🧠 interactions
```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horario_programado TIME,
  plan_id UUID REFERENCES plans(id),
  plan_version_id UUID REFERENCES plan_versions(id),
  mentorado_id UUID REFERENCES users(id),
  data_interacao TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('realizado', 'nao_realizado')) NOT NULL,
  justificativa TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### 🔔 notifications_sent
```sql
CREATE TABLE notifications_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  plan_version_id UUID NOT NULL REFERENCES plan_versions(id) ON DELETE CASCADE,
  mentorado_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT now(),
  UNIQUE (plan_id, mentorado_id, data, horario)
);
```
---
## 7. 🔐 Autenticação e Sessão

- JWT + armazenamento seguro
- Sessão persistente até logout manual
- Login com biometria (Touch ID / Face ID) se disponível
---
## 🔐 Autenticação — Considerações sobre Logout e OneSignal

### Problema:
Desvincular o OneSignal no momento do logout impediria o envio de notificações futuras ao mentorado, inclusive de planos já agendados, o que compromete o funcionamento principal do sistema.

### Solução adotada:
- **No logout tradicional**, o app **remove apenas o token JWT**, encerrando a sessão local.
- O `external_user_id` do OneSignal **é mantido vinculado ao usuário**, preservando o envio de notificações futuras.
- **Não se remove a associação do OneSignal** a menos que:
  - O app seja desinstalado
  - O usuário troque de conta no mesmo dispositivo

### Segurança adicional:
- O backend pode conter um campo `notificacoes_ativas` (boolean) para cada usuário.
  - No logout, marcamos esse campo como `false`.
  - O cron de notificações só envia push para usuários com `notificacoes_ativas = true`.
- Dessa forma, é possível controlar dinamicamente quem recebe notificações sem apagar a associação no OneSignal.
---
## 12. 📲 Navegação e UX

- React Navigation (Stack + Bottom Tabs)
- Fluxos separados para mentor e mentorado
- Navegação por tipo de usuário
- Telas:
  - Login + Splash
  - Dashboard mentor
  - Metas e planos do mentorado
  - Tela de interação (Realizado / Não Realizado + Justificativa)
---
## 13. 🎨 Design

- **Estilo:** leve, funcional, sem excesso visual
- **Framework:** Tailwind (NativeWind)
- **Cores:** roxo/azul escuro (primária), verde/vermelho (feedback)
- **Componentes:** cards, botões binários, progresso, tags de status
- **Acessibilidade:** tamanho de toque, fonte legível, ícones claros
- **Futuro:** animações com Reanimated ou Framer Motion
---
## 🧭 Wireframes e Fluxos

**Fluxo do Mentor:**
1. Login / biometria
2. Dashboard com todos os mentorados
3. Selecionar mentorado → Ver metas
4. Criar ou editar meta
5. Ver planos da meta
6. Criar plano novo ou editar existente
7. Avaliar performance e interações
8. Suspender / Excluir / Marcar meta como atingida

**Fluxo do Mentorado:**
1. Login / biometria
2. Dashboard com metas em andamento e atrasadas
3. Visualização dos planos ativos do dia
4. Notificação de planos pendentes
5. Responder: Realizado / Não realizado (com justificativa)
6. Visualizar histórico de interações
7. Consultar progresso e metas finalizadas
---
## 🧩 Estrutura de Pastas no App (React Native/Expo)

Organizada por domínio e com separação clara entre rotas, telas e componentes:

```
app/
├── assets/                  # Ícones, fontes, imagens
├── components/              # Componentes reutilizáveis (UI/UX)
├── constants/               # Cores, fontes, espaçamentos
├── hooks/                   # Custom hooks
├── navigation/              # Navegação e stacks (mentor/mentorado)
├── screens/
│   ├── Mentor/
│   │   ├── Dashboard.tsx
│   │   ├── MetaDetalhe.tsx
│   │   ├── CriarMeta.tsx
│   ├── Mentorado/
│   │   ├── Dashboard.tsx
│   │   ├── PlanoInteracao.tsx
│   │   ├── Historico.tsx
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Biometria.tsx
├── services/                # Comunicação com API
├── store/                   # Zustand ou Redux
├── utils/                   # Helpers e utilitários
├── types/                   # Tipagens globais
├── App.tsx
```
---
## 🌐 Checklist de APIs REST

Organizadas por módulo funcional.
---
## 📁 Organização dos Endpoints por Domínio

### 🔐 Auth (`/auth`)
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/onesignal`
---
## 🗂 Organização Sugerida de Controllers (REST)

A estrutura de arquivos e controllers REST recomendada segue o padrão modularizado:

```
src/
├── controllers/
│   ├── authController.ts
│   ├── userController.ts
│   ├── goalController.ts
│   ├── planController.ts
│   ├── planVersionController.ts
│   ├── interactionController.ts
│   ├── performanceController.ts
│   ├── notificationController.ts
│   └── utilController.ts
├── routes/
│   └── index.ts (consolida e organiza as rotas por módulo)
├── services/
│   ├── authService.ts
│   ├── userService.ts
│   ├── goalService.ts
│   ├── planService.ts
│   ├── notificationService.ts
│   └── ...
├── models/
│   └── (schemas do Prisma ou ORM utilizado)
```

Cada controller deve manter responsabilidade única e delegar lógica pesada para os serviços correspondentes. As rotas REST são agrupadas por domínio funcional para facilitar manutenção e escalabilidade.

---

## 📅 Geração de Interações Esperadas por `plan_version`

Cada versão de plano múltiplo define um conjunto de interações esperadas com base em dois campos:

- `dias_semana`: lista de dias da semana (ex: ['Mon', 'Wed', 'Fri'])
- `horarios`: lista de horários do dia (ex: ['08:00', '14:00'])

Para gerar as interações esperadas:
1. O sistema percorre o intervalo entre `data_inicio` da versão e a `data_limite` do plano
2. Para cada dia:
   - Verifica se o dia da semana está incluído em `dias_semana`
   - Se sim, cria uma interação esperada para **cada horário** em `horarios`
   - Cada ocorrência representa uma janela de execução futura

As interações não são pré-criadas na base, mas a lógica de performance e notificações assume que essas ocorrências existem virtualmente.

### Exemplo:
- `dias_semana = ['Mon', 'Wed']`
- `horarios = ['08:00', '18:00']`
- `data_inicio = 01/jul`
- `data_limite do plano = 14/jul`

O sistema espera 2 interações por dia × 2 dias por semana × 2 semanas = **8 interações esperadas**

Essas serão usadas para:
- Calcular performance (%)
- Verificar pendências e atrasos
- Agendar notificações

---



## 🧱 Infraestrutura e Stack de Execução

### 📱 Mobile
- **React Native com Expo**
- Builds por **EAS Build**
- Uso de biometria (`expo-local-authentication`)
- Armazenamento seguro com `expo-secure-store`
- Integração com OneSignal via SDK + API

### 🌐 Backend
- **Node.js + Express**
- Banco de dados: **PostgreSQL**
- Cache / fila / agendamento: **Redis**
- ORM: **Prisma**
- Notificações: **OneSignal (via API REST)**

### 🐳 Containers
Ambiente de desenvolvimento rodará com containers Docker:

- `postgres`: banco principal
- `redis`: para cron, agendamento e controle de notificações
- `app`: backend Node.js

### 🧪 Desenvolvimento Local
Será usado `docker-compose` para orquestrar:

- Banco de dados
- Redis
- Backend

O app Expo roda localmente ou via Expo Go durante o desenvolvimento.



---



## 🐳 Docker Compose — Desenvolvimento Local

Para facilitar o ambiente de desenvolvimento local, utilizamos um `docker-compose.yml` com os seguintes serviços:

### Serviços:

- `postgres` → banco de dados principal (porta 5432)
- `redis` → cache e agendamentos (porta 6379)

### Comandos principais:

```bash
# Subir os containers
docker-compose up -d

# Verificar os logs
docker-compose logs -f

# Acessar o banco (usando psql ou ferramenta gráfica)
psql -h localhost -U postgres -d mentoria
```

O backend pode ser configurado com a string de conexão:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mentoria
```

Redis pode ser acessado via `localhost:6379`.



---

## 📄 Arquivo `.env.example`

Para facilitar o setup local e em produção, o projeto inclui um arquivo `.env.example` com as variáveis esperadas pelo backend:

```env
# Banco de Dados PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mentoria

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OneSignal
ONESIGNAL_APP_ID=sua_app_id_aqui
ONESIGNAL_API_KEY=sua_api_key_rest_aqui

# Timezone padrão
DEFAULT_TIMEZONE=America/Sao_Paulo
```

**Recomenda-se duplicar este arquivo como `.env` e preencher com os valores reais.**

---

## 📦 Arquivo `docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mentoria
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    restart: always
    ports:
      - "6379:6379"

volumes:
  pgdata:
```


---

## 📄 Arquivo `.env.example` (conteúdo completo)

```env
# Banco de Dados PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mentoria

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OneSignal
ONESIGNAL_APP_ID=sua_app_id_aqui
ONESIGNAL_API_KEY=sua_api_key_rest_aqui

# Timezone padrão (caso queira fallback)
DEFAULT_TIMEZONE=America/Sao_Paulo
```

---

## 🕒 Regra Global de Horários — Compatibilidade com Cron

Para garantir o envio pontual de notificações e evitar comportamentos indesejados, o sistema impõe a seguinte regra:

> **Todos os planos — sejam de interação única ou múltipla — só podem ser criados com horários que coincidam com a execução do cron, que roda a cada 15 minutos.**

### Horários válidos:
- `08:00`, `08:15`, `08:30`, `08:45`, `09:00`, ...

### Horários inválidos:
- `08:12`, `09:07`, `14:23`, ...

### Essa regra será aplicada:
- No **frontend**: por meio de campos de seleção limitados (dropdown ou step de 15 minutos)
- No **backend**: com validação explícita ao salvar um plano ou ao editar

### Motivação:
- O cron de notificações é disparado a cada 15 minutos
- Para que as notificações sejam enviadas com precisão no momento esperado, os horários precisam ser exatamente os mesmos do cron
- Evita janelas de tolerância imprecisas e mensagens duplicadas ou atrasadas

### Impacto:
- Simplicidade e previsibilidade no envio de notificações
- Uniformidade na experiência dos mentorados
- Alinhamento total entre agendamento de planos e engine de disparo

---

## ⏰ Cron de Notificações — Funcionamento Oficial

O cron roda automaticamente a cada 15 minutos (exatamente nos minutos `00`, `15`, `30`, `45`) e verifica todos os planos com interações agendadas **para aquele horário específico**.

### 🎯 O que será notificado:

- **Planos de interação múltipla**: se hoje é um dos `dias_semana` e o `horario_programado` for igual ao horário do cron
- **Planos de interação única**: se a `data_programada` é hoje e o `horario_programado` for igual ao horário do cron

### ✅ Regras para envio:

- `notificacoes_ativas = true` no usuário
- Não pode existir interação já registrada para aquele horário/data
- Não pode existir registro na tabela `notifications_sent` para aquele plano, horário e data

### 💬 Exemplo de lógica:

```ts
if (
  plano.ativo &&
  horario_programado === horario_atual_cron &&
  (
    (plano.tipo === 'multipla' && hoje in plano.dias_semana) ||
    (plano.tipo === 'unica' && data === hoje)
  ) &&
  !interagiuHoje(mentorado.id, plano.id, horario) &&
  !foiNotificadoHoje(mentorado.id, plano.id, horario)
) {
  sendPush(...)
  registrarNotificacao(...)
}
```

### 🧱 Observação importante:

Todos os planos devem ter `horario_programado` como múltiplo de 15 minutos.  
**Essa regra é obrigatória para todos os tipos de plano.**