#!/bin/bash
# AI Arbitration - Run Both Services

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "  AI Arbitration - Running Services"
echo "========================================"
echo ""

# Start backend in background
echo "Starting Backend..."
cd backend
./start.sh &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend in background
echo "Starting Frontend..."
cd frontend
./start.sh &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  Services Started!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
