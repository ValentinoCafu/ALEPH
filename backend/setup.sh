#!/bin/bash
# AI Arbitration Backend - Setup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "  AI Arbitration - Backend Setup"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "Found existing .env file."
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env from .env.example
echo "Creating .env file from template..."
cp .env.example .env

# Remind user to configure their private key
if grep -q "aqui-va-tu-private-key" .env 2>/dev/null; then
    echo ""
    echo "IMPORTANT: Please edit .env and add your own PRIVATE_KEY"
    echo "Get it from MetaMask: Account Details → Export Private Key"
fi

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'chmod +x start.sh && ./start.sh' to start the backend"
echo "2. API documentation will be available at http://localhost:8000/docs"
echo ""
