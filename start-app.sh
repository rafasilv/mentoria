#!/bin/bash

echo "🚀 Iniciando Sistema de Mentoria Completo..."

# Verificar se o backend está rodando
echo "🔍 Verificando backend..."
if ! curl -s http://localhost:3000/healthcheck > /dev/null; then
    echo "❌ Backend não está rodando!"
    echo "💡 Iniciando backend..."
    cd backend && npm run dev &
    cd ..
    sleep 5
else
    echo "✅ Backend já está funcionando!"
fi

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando todos os processos..."
    pkill -f "npm run dev"
    pkill -f "expo start"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

echo ""
echo "📱 Iniciando app mobile e web..."
echo "🌐 Web: http://localhost:8081"
echo "📱 Mobile: Escaneie o QR code"
echo ""
echo "⏹️  Pressione Ctrl+C para parar tudo"
echo ""

cd app

# Iniciar web em background
echo "🌐 Iniciando versão web..."
npx expo start --web &
WEB_PID=$!

# Aguardar um pouco para a web inicializar
sleep 3

# Iniciar mobile no foreground
echo "📱 Iniciando versão mobile..."
npx expo start

# Se chegou aqui, o processo mobile foi interrompido
# Limpar o processo web também
kill $WEB_PID 2>/dev/null 