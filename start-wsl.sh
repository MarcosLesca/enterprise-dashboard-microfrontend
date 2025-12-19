#!/bin/bash

# Enterprise Dashboard - Quick Start Script for Ubuntu WSL
# Simple version that works with Nx monorepo

set -e

echo "🎯 Enterprise Dashboard - Quick Start (WSL Edition)"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print() {
    echo -e "${2}${1}${NC}"
}

# Start Django
start_django() {
    print "🚀 Starting Django API..." $YELLOW
    cd django-api
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -q -r requirements.txt
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@enterprise.com').exists() or User.objects.create_superuser('admin@enterprise.com', 'admin', 'Enterprise123!')" | python manage.py shell
    python manage.py migrate
    
    python manage.py runserver 0.0.0.0:8000 &
    DJANGO_PID=$!
    cd ..
    
    sleep 3
    if curl -s http://localhost:8000 >/dev/null; then
        print "✅ Django API started!" $GREEN
        print "📱 API: http://localhost:8000" $BLUE
        print "🔧 Admin: http://localhost:8000/admin/" $BLUE
        return 0
    else
        print "❌ Django failed to start" $RED
        return 1
    fi
}

# Try React first (easier)
start_react() {
    print "🚀 Starting React Analytics..." $YELLOW
    npx nx serve react-analytics-react-analytics &
    REACT_PID=$!
    
    sleep 20
    if curl -s http://localhost:4201 >/dev/null; then
        print "✅ React Analytics started!" $GREEN
        print "📱 React: http://localhost:4201" $BLUE
        echo $REACT_PID > /tmp/react.pid
        return 0
    else
        kill $REACT_PID 2>/dev/null || true
        print "⚠️ React Analytics failed to start" $YELLOW
        return 1
    fi
}

# Try Angular (more complex)
start_angular() {
    print "🚀 Starting Angular Shell..." $YELLOW
    
    # Reset Nx cache
    npx nx reset
    
    # Try Nx serve with timeout
    timeout 60 npx nx serve angular-shell 2>/dev/null &
    ANGULAR_PID=$!
    
    sleep 25
    if curl -s http://localhost:4200 >/dev/null; then
        print "✅ Angular Shell started!" $GREEN
        print "📱 Angular: http://localhost:4200" $BLUE
        echo $ANGULAR_PID > /tmp/angular.pid
        return 0
    else
        kill $ANGULAR_PID 2>/dev/null || true
        print "⚠️ Angular Shell failed to start - will try static build" $YELLOW
        
        # Try build and serve static
        print "🏗️ Building Angular for static serving..." $BLUE
        timeout 90 npx nx build angular-shell || true
        
        if [ -d "dist/angular-shell/browser" ]; then
            cd dist/angular-shell/browser
            python3 -m http.server 4200 &
            STATIC_PID=$!
            cd ../../..
            
            sleep 3
            if curl -s http://localhost:4200 >/dev/null; then
                print "✅ Angular Shell (static) started!" $GREEN
                print "📱 Angular: http://localhost:4200" $BLUE
                echo $STATIC_PID > /tmp/angular.pid
                return 0
            else
                kill $STATIC_PID 2>/dev/null || true
            fi
        fi
        
        print "❌ Angular Shell failed completely" $RED
        return 1
    fi
}

# Main execution
print "🔍 Checking system..."
print "   Node.js: $(node --version 2>/dev/null || echo 'Not found')"
print "   Python3: $(python3 --version)"
print "   npm: $(npm --version 2>/dev/null || echo 'Not found')"

echo ""
print "🚀 Starting services..."

# Start Django (critical)
if start_django; then
    DJANGO_SUCCESS=true
else
    DJANGO_SUCCESS=false
fi

# Start frontends (best effort)
FRONTEND_SUCCESS=false

# Try React first
if start_react; then
    FRONTEND_SUCCESS=true
fi

# Try Angular
if start_angular; then
    FRONTEND_SUCCESS=true
fi

# Show final status
echo ""
print "📊 FINAL STATUS:" $YELLOW
print "=====================================" $BLUE

if [ "$DJANGO_SUCCESS" = true ]; then
    print "✅ Django API:      http://localhost:8000" $GREEN
    print "✅ Django Admin:    http://localhost:8000/admin/" $GREEN
else
    print "❌ Django API:      Failed" $RED
fi

if [ "$FRONTEND_SUCCESS" = true ]; then
    if curl -s http://localhost:4200 >/dev/null; then
        print "✅ Angular Shell:   http://localhost:4200" $GREEN
    fi
    if curl -s http://localhost:4201 >/dev/null; then
        print "✅ React Analytics: http://localhost:4201" $GREEN
    fi
else
    print "❌ Frontend Apps:   Failed" $RED
fi

echo ""
print "🔑 Django Credentials:" $YELLOW
print "   Email: admin@enterprise.com" $BLUE
print "   Password: Enterprise123!" $BLUE

if [ "$DJANGO_SUCCESS" = true ]; then
    echo ""
    print "🎉 Backend is ready for development!" $GREEN
    print "💡 You can test API endpoints even if frontends fail" $BLUE
else
    echo ""
    print "❌ Critical services failed to start" $RED
    exit 1
fi

echo ""
print "💡 Press Ctrl+C to stop services" $YELLOW

# Cleanup function
cleanup() {
    echo ""
    print "🛑 Stopping services..." $YELLOW
    
    # Kill Django
    pkill -f "manage.py runserver" 2>/dev/null || true
    
    # Kill frontends
    [ -f "/tmp/react.pid" ] && kill $(cat /tmp/react.pid) 2>/dev/null || true
    [ -f "/tmp/angular.pid" ] && kill $(cat /tmp/angular.pid) 2>/dev/null || true
    
    # Kill any remaining processes
    pkill -f "nx serve" 2>/dev/null || true
    pkill -f "python -m http.server" 2>/dev/null || true
    
    # Clean temp files
    rm -f /tmp/react.pid /tmp/angular.pid
    
    print "✅ All services stopped" $GREEN
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait