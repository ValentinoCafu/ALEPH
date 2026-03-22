#!/bin/bash
# AI Arbitration Frontend - Start Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "  AI Arbitration - Frontend"
echo "========================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Dependencies not found. Running setup..."
    chmod +x setup.sh
    ./setup.sh
fi

echo ""
echo "Starting Vite dev server..."
echo "Frontend will be available at http://localhost:5173"
echo ""

# Start the frontend
npm run dev
