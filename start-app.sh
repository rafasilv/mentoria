#!/bin/bash

# Debug: mostrar caminho do script e diretório atual
echo "[DEBUG] Script path: $0"
echo "[DEBUG] Script dir: $(dirname $0)"
echo "[DEBUG] PWD antes do cd app: $PWD"

# Sempre execute a partir da pasta onde o script está salvo (mesmo com symlink ou shell externo)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR"
echo "[DEBUG] Executando em: $PWD"

APP_DIR="$SCRIPT_DIR/app"
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  echo "[DEBUG] PWD depois do cd app: $PWD"
else
  echo "[ERRO] Diretório 'app' não encontrado em $SCRIPT_DIR"
  exit 1
fi

echo "🚀 Iniciando Sistema de Mentoria Completo..."

# Verificar se o backend está rodando
echo "🔍 Verificando backend..."
if ! curl -s http://localhost:3000/healthcheck > /dev/null; then
    echo "❌ Backend não está rodando!"
    echo "💡 Iniciando backend..."
    cd "$SCRIPT_DIR/backend" && npm run dev &
    cd "$APP_DIR"
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

# Iniciar web em background
echo "🌐 Iniciando versão web..."
pushd "$APP_DIR" > /dev/null
npx expo start --web &
WEB_PID=$!
popd > /dev/null

# Aguardar um pouco para a web inicializar
sleep 3

# Iniciar mobile no foreground
echo "📱 Iniciando versão mobile..."
pushd "$APP_DIR" > /dev/null
npx expo start
popd > /dev/null

# Se chegou aqui, o processo mobile foi interrompido
# Limpar o processo web também
kill $WEB_PID 2>/dev/null 