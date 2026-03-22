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

# Check if PRIVATE_KEY is set
if grep -q "PRIVATE_KEY=0ce8660eebcc62476f76ab59e3ca54a55b34d4bc80626048155edf580e623bd8" .env 2>/dev/null; then
    echo ""
    echo "Using pre-configured wallet private key."
fi

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'chmod +x start.sh && ./start.sh' to start the backend"
echo "2. API documentation will be available at http://localhost:8000/docs"
echo ""
