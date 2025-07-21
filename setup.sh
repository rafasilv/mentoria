#!/bin/bash

echo "🚀 Iniciando setup do Sistema de Mentoria..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

echo "✅ Dependências básicas verificadas"

# Copiar arquivo de ambiente
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Arquivo .env criado. Configure as variáveis de ambiente conforme necessário."
else
    echo "📝 Arquivo .env já existe."
fi

# Sincronizar .env com o backend
cp .env backend/.env
echo "📝 Arquivo .env sincronizado com o backend."

# Subir containers
echo "🐳 Subindo containers Docker..."
docker-compose up -d

# Aguardar containers estarem prontos
echo "⏳ Aguardando containers estarem prontos..."
sleep 10

# Verificar se PostgreSQL está funcionando
echo "🔍 Verificando conexão com PostgreSQL..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec mentoria-postgres-1 pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ PostgreSQL está pronto!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ PostgreSQL não está respondendo após $max_attempts tentativas."
        echo "Verifique se os containers estão rodando: docker-compose ps"
        exit 1
    fi
    
    echo "⏳ Tentativa $attempt/$max_attempts - Aguardando PostgreSQL..."
    sleep 2
    attempt=$((attempt + 1))
done

# Verificar se Redis está funcionando
echo "🔍 Verificando conexão com Redis..."
if docker exec mentoria-redis-1 redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis está pronto!"
else
    echo "❌ Redis não está respondendo."
    echo "Verifique se os containers estão rodando: docker-compose ps"
    exit 1
fi

# Configurar backend
echo "🔧 Configurando backend..."
cd backend

# Instalar dependências
echo "📦 Instalando dependências do backend..."
npm install

# Gerar cliente Prisma
echo "🗄️ Gerando cliente Prisma..."
if ! npm run prisma:generate; then
    echo "❌ Erro ao gerar cliente Prisma. Verifique o schema."
    exit 1
fi

# Executar migrações
echo "🔄 Executando migrações do banco..."
if ! npm run prisma:migrate; then
    echo "❌ Erro ao executar migrações. Verifique a conexão com o banco."
    exit 1
fi

# Popular banco com dados de teste
echo "🌱 Populando banco com dados de teste..."
if ! npm run prisma:seed; then
    echo "❌ Erro ao popular banco. Verifique os dados de seed."
    exit 1
fi

cd ..

# Configurar app mobile/web
echo "📱 Configurando app mobile/web..."
cd app

# Instalar dependências
echo "📦 Instalando dependências do app..."
npm install --legacy-peer-deps

# Instalar dependências web
echo "🌐 Instalando dependências web..."
npx expo install react-dom react-native-web @expo/metro-runtime

# Corrigir versões incompatíveis
echo "🔧 Corrigindo versões incompatíveis..."
npx expo install --fix

cd ..

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Inicie o backend: cd backend && npm run dev"
echo "2. Inicie o app completo: ./start-app.sh"
echo "   - Ou apenas mobile: cd app && npx expo start"
echo "   - Ou apenas web: cd app && npx expo start --web"
echo ""
echo "🔑 Credenciais de teste:"
echo "Mentor: joao@mentoria.com / 123456"
echo "Mentorado 1: maria@mentoria.com / 123456"
echo "Mentorado 2: pedro@mentoria.com / 123456"
echo ""
echo "🌐 URLs de acesso:"
echo "   - Backend: http://localhost:3000"
echo "   - Web: http://localhost:8081"
echo "   - Health check: http://localhost:3000/healthcheck"
echo ""
echo "🔧 Para verificar se tudo está funcionando:"
echo "   - Backend: curl http://localhost:3000/healthcheck"
echo "   - PostgreSQL: docker exec mentoria-postgres-1 pg_isready -U postgres"
echo "   - Redis: docker exec mentoria-redis-1 redis-cli ping" 