#!/bin/bash
# AI Arbitration Backend - Start Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "  AI Arbitration - Backend"
echo "========================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "ERROR: .env file not found!"
    echo "Run 'chmod +x setup.sh && ./setup.sh' first to create it."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo ""
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Verify venv has pip
if [ ! -f "$SCRIPT_DIR/venv/bin/pip" ]; then
    echo ""
    echo "Recreating virtual environment (pip not found)..."
    rm -rf venv
    python3 -m venv venv
fi

echo "Using virtual environment at: $SCRIPT_DIR/venv"

# Use venv's pip and python directly (avoid activation issues in background)
PIP_CMD="$SCRIPT_DIR/venv/bin/pip"
PYTHON_CMD="$SCRIPT_DIR/venv/bin/python"

# Install dependencies if needed
if ! $PIP_CMD show fastapi > /dev/null 2>&1; then
    echo ""
    echo "Installing dependencies..."
    $PIP_CMD install -r "$SCRIPT_DIR/requirements.txt"
fi

echo ""
echo "Starting FastAPI server..."
echo "API Documentation: http://localhost:8000/docs"
echo ""

# Start the server using venv python
$PYTHON_CMD -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
