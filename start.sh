#!/bin/bash

# LinkedIn Engagement Extractor - Start Script
# This script starts both the backend and frontend servers

echo "🚀 Starting LinkedIn Engagement Extractor..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Set up backend
echo -e "${BLUE}📦 Setting up backend...${NC}"
cd "$SCRIPT_DIR/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt -q

# Set environment variables
export RAPIDAPI_KEY="56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"
export FLASK_DEBUG="True"
export PORT="5001"
export DEMO_MODE="False"

# Start backend in background
echo -e "${GREEN}✅ Starting backend server on http://localhost:5001${NC}"
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo -e "${BLUE}🌐 Starting frontend server...${NC}"
cd "$SCRIPT_DIR/frontend"

# Start frontend server
echo -e "${GREEN}✅ Starting frontend server on http://localhost:8080${NC}"
python3 -m http.server 8080 &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo -e "${GREEN}🎉 Application is running!${NC}"
echo ""
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:5001"
echo ""
echo "   Press Ctrl+C to stop all servers"
echo "============================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Goodbye!"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait

