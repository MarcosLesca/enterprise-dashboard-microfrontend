#!/bin/bash

# Enterprise Dashboard - Quick Start Script (Ubuntu/Debian)
# Simplified version for immediate testing

set -e

echo "🎯 Enterprise Dashboard - Quick Start"
echo "====================================="

# Function to check port
check_port() {
    local port=$1
    if curl -s "http://localhost:$port" >/dev/null; then
        echo "✅ Port $port: Running"
        return 0
    else
        echo "❌ Port $port: Not available"
        return 1
    fi
}

# Function to start Django
start_django() {
    echo "🚀 Starting Django API..."
    cd django-api
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -q -r requirements.txt
    python manage.py migrate
    python manage.py runserver 0.0.0.0:8000 &
    DJANGO_PID=$!
    cd ..
    echo "✅ Django API started (PID: $DJANGO_PID)"
}

# Function to start Angular (simplified)
start_angular() {
    echo "🚀 Starting Angular Shell..."
    cd angular-shell
    # Try different methods
    if command -v ng >/dev/null 2>&1; then
        ng serve --port 4200 &
    elif [ -f "package.json" ]; then
        npm start &
    else
        echo "❌ Cannot start Angular - missing dependencies"
        return 1
    fi
    ANGULAR_PID=$!
    cd ..
    echo "✅ Angular Shell started (PID: $ANGULAR_PID)"
}

# Function to start React (simplified)
start_react() {
    echo "🚀 Starting React Analytics..."
    cd react-analytics/react-analytics
    if [ -f "package.json" ]; then
        npm run dev &
    else
        echo "❌ Cannot start React - missing package.json"
        return 1
    fi
    REACT_PID=$!
    cd ../..
    echo "✅ React Analytics started (PID: $REACT_PID)"
}

# Main execution
echo "🔍 Checking system..."
echo "Node.js: $(node --version 2>/dev/null || echo 'Not found')"
echo "Python3: $(python3 --version)"
echo "npm: $(npm --version 2>/dev/null || echo 'Not found')"

echo ""
echo "🚀 Starting services..."

# Start Django
start_django
sleep 3

# Check Django
if check_port 8000; then
    echo "✅ Django API is accessible at http://localhost:8000"
fi

# Show status
echo ""
echo "📊 Service Status:"
check_port 4200 && echo "   Angular Shell: http://localhost:4200"
check_port 4201 && echo "   React Analytics: http://localhost:4201"  
check_port 8000 && echo "   Django API: http://localhost:8000"
check_port 8000 && echo "   Django Admin: http://localhost:8000/admin/"

echo ""
echo "🔑 Django Credentials:"
echo "   Email: admin@enterprise.com"
echo "   Password: Enterprise123!"
echo ""
echo "💡 Press Ctrl+C to stop services"

# Trap for cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $DJANGO_PID 2>/dev/null || true
    kill $ANGULAR_PID 2>/dev/null || true
    kill $REACT_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait