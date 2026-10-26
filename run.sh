#!/usr/bin/env bash
# ==============================================================================
# Unified Local Runner for Online Auction System (Linux / macOS)
# ==============================================================================

set -e

echo "=========================================================="
echo "       ONLINE AUCTION SYSTEM - LOCAL STARTUP RUNNER       "
echo "=========================================================="

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    exit 1
fi
echo "[OK] Node.js detected: $(node -v)"

# 2. Check and copy .env
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ ! -f "$DIR/.env" ]; then
    if [ -f "$DIR/.env.example" ]; then
        cp "$DIR/.env.example" "$DIR/.env"
        echo "[OK] Created .env from .env.example"
    fi
fi

# 3. Check node_modules
if [ ! -d "$DIR/node_modules" ]; then
    echo "[*] Installing npm dependencies..."
    npm install
fi

# 4. Start Server
export PORT="${PORT:-3008}"
echo "=========================================================="
echo "  Starting Online Auction System on Port $PORT"
echo "  Application URL: http://localhost:$PORT"
echo "  Health Check:    http://localhost:$PORT/health"
echo "=========================================================="

npm start
