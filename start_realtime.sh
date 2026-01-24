#!/bin/bash

# Veeru's Pro Academy - Real-Time Services Startup Script
# This script starts all required services for real-time features

set -e

echo "🚀 Starting Veeru's Pro Academy Real-Time Services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Redis is running
echo -n "Checking Redis... "
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "Please start Redis first:"
    echo "  macOS: brew services start redis"
    echo "  Linux: sudo systemctl start redis"
    exit 1
fi

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo -e "${YELLOW}⚠ Virtual environment not activated${NC}"
    echo "Activating .venv..."
    if [ -d ".venv" ]; then
        source .venv/bin/activate
    else
        echo -e "${RED}✗ Virtual environment not found${NC}"
        echo "Please create one: python -m venv .venv"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    echo "Copying from .env.realtime.example..."
    cp .env.realtime.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo "Please edit .env with your configuration"
fi

# Run migrations
echo ""
echo "Running migrations..."
python manage.py migrate

# Create log directory
mkdir -p logs

echo ""
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "Starting services in separate terminals..."
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Opening terminals on macOS..."
    
    # Terminal 1: Daphne
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && source .venv/bin/activate && echo \"🌐 Starting Daphne (WebSocket + HTTP Server)...\" && daphne -b 0.0.0.0 -p 8000 academy.asgi:application"'
    
    # Terminal 2: Celery Worker
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && source .venv/bin/activate && sleep 3 && echo \"⚙️  Starting Celery Worker (Background Tasks)...\" && celery -A academy worker --loglevel=info"'
    
    # Terminal 3: Celery Beat
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && source .venv/bin/activate && sleep 5 && echo \"⏰ Starting Celery Beat (Scheduled Tasks)...\" && celery -A academy beat --loglevel=info"'
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Starting services on Linux..."
    
    # Check if gnome-terminal is available
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="Daphne" -- bash -c "source .venv/bin/activate && echo '🌐 Starting Daphne...' && daphne -b 0.0.0.0 -p 8000 academy.asgi:application; exec bash"
        gnome-terminal --tab --title="Celery Worker" -- bash -c "source .venv/bin/activate && sleep 3 && echo '⚙️  Starting Celery Worker...' && celery -A academy worker --loglevel=info; exec bash"
        gnome-terminal --tab --title="Celery Beat" -- bash -c "source .venv/bin/activate && sleep 5 && echo '⏰ Starting Celery Beat...' && celery -A academy beat --loglevel=info; exec bash"
    else
        echo "Please run these commands in separate terminals:"
        echo ""
        echo "Terminal 1: daphne -b 0.0.0.0 -p 8000 academy.asgi:application"
        echo "Terminal 2: celery -A academy worker --loglevel=info"
        echo "Terminal 3: celery -A academy beat --loglevel=info"
    fi
else
    echo "Please run these commands in separate terminals:"
    echo ""
    echo "Terminal 1: daphne -b 0.0.0.0 -p 8000 academy.asgi:application"
    echo "Terminal 2: celery -A academy worker --loglevel=info"
    echo "Terminal 3: celery -A academy beat --loglevel=info"
fi

echo ""
echo -e "${GREEN}✓ Services starting...${NC}"
echo ""
echo "📱 Application will be available at: http://localhost:8000"
echo "🔧 Admin panel: http://localhost:8000/admin/"
echo ""
echo "To stop all services, close the terminal windows or press Ctrl+C in each"
echo ""
echo "📚 For more information, see REALTIME_SETUP.md"
