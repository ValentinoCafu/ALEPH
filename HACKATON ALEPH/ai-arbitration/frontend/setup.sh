#!/bin/bash
# AI Arbitration Frontend - Setup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "  AI Arbitration - Frontend Setup"
echo "========================================"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "Dependencies already installed."
else
    echo "Installing dependencies with npm..."
    npm install
fi

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'chmod +x start.sh && ./start.sh' to start the frontend"
echo "2. Frontend will be available at http://localhost:5173"
echo ""
