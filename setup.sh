#!/bin/bash
# AI Arbitration - Complete Setup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "  AI Arbitration - Complete Setup"
echo "========================================"
echo ""

# Setup backend
echo "Setting up Backend..."
cd backend
chmod +x setup.sh start.sh
./setup.sh
cd ..

# Setup frontend
echo ""
echo "Setting up Frontend..."
cd frontend
chmod +x setup.sh start.sh
./setup.sh
cd ..

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && ./start.sh"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && ./start.sh"
echo ""
echo "Or use this script to run both in background:"
echo "  ./run.sh"
echo ""
