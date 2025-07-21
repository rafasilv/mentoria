# 🎯 Sistema de Mentoria

Sistema completo de mentoria com backend Node.js/Express e app React Native/Expo, seguindo as especificações detalhadas nos documentos de regras e escopo.

## 🏗️ Arquitetura

### Backend
- **Node.js + Express**
- **PostgreSQL** com Prisma ORM
- **Redis** para cache e agendamento
- **JWT** para autenticação
- **OneSignal** para notificações push
- **Cron jobs** para notificações automáticas

### App Mobile/Web
- **React Native + Expo**
- **StyleSheet nativo** para estilização
- **React Navigation** para navegação
- **Expo Local Authentication** para biometria (mobile)
- **Expo Secure Store** para armazenamento seguro
- **OneSignal SDK** para notificações
- **Suporte Web** com React Native Web

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- Expo CLI (`npm install -g @expo/cli`)

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd mentoria
```

### 2. Configurar ambiente
```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar variáveis de ambiente
nano .env
```

### 3. Subir containers
```bash
# Subir PostgreSQL e Redis
docker-compose up -d

# Verificar se estão rodando
docker-compose ps
```

### 4. Configurar backend
```bash
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular banco com dados de teste
npm run prisma:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

### 5. Configurar app mobile/web
```bash
cd app

# Instalar dependências
npm install

# Iniciar Expo (mobile)
npx expo start

# Iniciar Expo (web)
npx expo start --web

# Ou usar o script automatizado (recomendado)
./start-app.sh
```

## 🌐 Plataformas Suportadas

### 📱 Mobile
- **Android** - Via Expo Go ou APK
- **iOS** - Via Expo Go ou App Store

### 🌐 Web
- **Navegadores modernos** - Chrome, Firefox, Safari, Edge
- **Responsivo** - Adapta-se a diferentes tamanhos de tela
- **PWA** - Funciona offline e pode ser instalado

## 📱 Funcionalidades

### 👨‍🏫 Mentor
- Criar e gerenciar metas para mentorados
- Criar planos de interação única ou múltipla
- Acompanhar performance dos mentorados
- Editar metas e planos ativos
- Definir status final das metas

### 👥 Mentorado
- Visualizar metas e planos atribuídos
- Registrar interações (realizado/não realizado)
- Receber notificações push
- Consultar histórico e progresso
- Autenticação biométrica

## 🔔 Sistema de Notificações

### Cron Jobs
- Executa a cada 15 minutos
- Notifica planos no horário exato programado
- Evita notificações duplicadas
- Envia resumo de pendências acumuladas

### Regras de Horários
- Todos os horários devem ser múltiplos de 15 minutos
- Compatível com execução do cron job
- Validação automática no backend e frontend

## 🗄️ Estrutura do Banco

### Tabelas Principais
- `users` - Usuários (mentor/mentorado)
- `goals` - Metas criadas pelos mentores
- `plans` - Planos dentro das metas
- `plan_versions` - Versões dos planos
- `interactions` - Interações dos mentorados
- `notifications_sent` - Controle de notificações
- `notifications_summary_sent` - Controle de resumos

## 🔐 Autenticação

### JWT
- Tokens com expiração configurável
- Middleware de autenticação e autorização
- Validação por tipo de usuário (mentor/mentorado)

### Biometria
- Touch ID / Face ID quando disponível
- Fallback para senha
- Armazenamento seguro com Expo Secure Store

## 📊 Performance

### Cálculo
- Baseado em interações realizadas vs esperadas
- Por plano, meta e mentorado
- Considera apenas versão vigente do plano
- Percentual arredondado para 2 casas decimais

## 🧪 Testes

### Credenciais de Teste
```
Mentor: joao@mentoria.com / 123456
Mentorado 1: maria@mentoria.com / 123456
Mentorado 2: pedro@mentoria.com / 123456
```

### Endpoints de Teste
- `GET /healthcheck` - Status do servidor
- `POST /notifications/test-summary` - Forçar notificação de resumo

## 🚀 Inicialização Rápida

### Script Automatizado (Recomendado)
```bash
# Setup completo (primeira vez)
./setup.sh

# Iniciar tudo (backend + mobile + web)
./start-app.sh
```

### 🔧 Correções Implementadas

- ✅ **CORS configurado** para aceitar requisições da web
- ✅ **Storage unificado** - funciona tanto na web (localStorage) quanto no mobile (SecureStore)
- ✅ **Compatibilidade web** - app funciona perfeitamente no navegador
- ✅ **Autenticação cross-platform** - login funciona em mobile e web

### 🎨 Framework de Design - NativeWind Puro

- ✅ **NativeWind** - Tailwind CSS para React Native
- ✅ **Componentes Removidos** - Sem componentes customizados
- ✅ **Elementos Nativos** - TouchableOpacity, TextInput, View + classes
- ✅ **Telas Convertidas** - LoginScreen, Dashboards com classes Tailwind
- ✅ **Theme Removido** - Sistema antigo removido completamente
- ✅ **StyleSheet Eliminado** - Apenas className com Tailwind
- ✅ **Exemplo Prático** - ExampleScreen mostrando padrões

## 🛠️ Comandos Úteis

### Backend
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Testes
npm test
```

### App
```bash
# Desenvolvimento
npx expo start

# Build
eas build --platform android
eas build --platform ios
```

### Docker
```bash
# Subir containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

## 📋 Endpoints da API

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/onesignal` - Registrar OneSignal

### Usuários
- `GET /users/me` - Perfil do usuário
- `GET /users/mentorados` - Lista de mentorados (mentor)
- `GET /users/mentor` - Informações do mentor (mentorado)

### Metas
- `POST /goals` - Criar meta
- `PUT /goals/:id` - Editar meta
- `PATCH /goals/:id/status` - Atualizar status
- `GET /goals/mentorado/:mentorado_id` - Metas do mentorado
- `GET /goals/my` - Minhas metas (mentorado)

### Planos
- `POST /plans` - Criar plano
- `PUT /plans/:id` - Editar plano (cria nova versão)
- `GET /plans/:id` - Detalhes do plano
- `GET /plans/today` - Planos do dia (mentorado)

### Interações
- `POST /interactions` - Registrar interação
- `GET /interactions/plan/:plan_id` - Interações do plano
- `GET /interactions/today` - Minhas interações de hoje

### Performance
- `GET /performance/plan/:plan_id` - Performance do plano
- `GET /performance/goal/:goal_id` - Performance da meta
- `GET /performance/mentorado/:mentorado_id` - Performance do mentorado

### Notificações
- `POST /notifications/test-summary` - Teste de notificação

## 🔧 Configuração de Produção

### Variáveis de Ambiente
```env
# Banco de Dados
DATABASE_URL=postgresql://user:pass@host:5432/mentoria

# JWT
JWT_SECRET=sua_chave_super_secreta
JWT_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OneSignal
ONESIGNAL_APP_ID=seu_app_id
ONESIGNAL_API_KEY=sua_api_key

# Servidor
PORT=3000
NODE_ENV=production
```

### Deploy
1. Configurar banco PostgreSQL em produção
2. Configurar Redis em produção
3. Configurar OneSignal
4. Deploy do backend (Railway, Heroku, VPS)
5. Build do app via EAS Build

## 📄 Documentação

- [Regras do Projeto](./docs/regras.md)
- [Escopo Funcional](./docs/escopo.md)
- [Lista de Tarefas](./tarefas.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 