#!/bin/bash

# Enterprise Dashboard - Ultimate Development Script
# Handles both quick start and full setup

set -e

echo "🎯 Enterprise Dashboard - Development Environment"
echo "================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo -e "\n${BOLD}🎯 Enterprise Dashboard - Development${NC}"
    echo -e "${CYAN}=============================================${NC}"
}

# Function to show usage
show_usage() {
    print_header
    print "📖 Usage:" $BOLD
    print "  ./dev.sh [mode]" $CYAN
    echo
    print "🚀 Available Modes:" $BOLD
    print "  quick     - Start only Django API (instant)" $GREEN
    print "  backend   - Setup and run Django with migrations" $GREEN
    print "  frontend  - Install npm deps and start frontends" $YELLOW
    print "  full      - Complete setup (backend + frontend)" $BLUE
    print "  status    - Check running services" $CYAN
    print "  stop      - Stop all services" $RED
    print "  clean     - Clean all caches and dependencies" $RED
    echo
    print "💡 Examples:" $YELLOW
    print "  ./dev.sh quick      # Start API instantly" $CYAN
    print "  ./dev.sh backend    # Full backend setup" $CYAN
    print "  ./dev.sh full       # Complete environment" $CYAN
}

# Quick Django start (no setup)
start_django_quick() {
    print "🚀 Quick Django Start..." $YELLOW
    cd django-api
    
    if [ -d "venv" ]; then
        source venv/bin/activate
        python manage.py runserver 0.0.0.0:8000 &
        DJANGO_PID=$!
        cd ..
        print "✅ Django API started (PID: $DJANGO_PID)" $GREEN
        print "📱 API: http://localhost:8000" $BLUE
        print "🔧 Admin: http://localhost:8000/admin/" $BLUE
        echo $DJANGO_PID > /tmp/django.pid
        return 0
    else
        print "❌ Django environment not found. Run './dev.sh backend' first" $RED
        return 1
    fi
}

# Full Django setup
setup_django_full() {
    print_header
    print "🐍 Setting up Django Backend..." $YELLOW
    cd django-api
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        print "📦 Creating Python virtual environment..." $BLUE
        python3 -m venv venv
    fi
    
    # Activate and install
    source venv/bin/activate
    print "📦 Installing Python dependencies..." $BLUE
    pip install -r requirements.txt
    
    # Run migrations
    print "🗄️ Running database migrations..." $BLUE
    python manage.py migrate
    
    # Create superuser if needed
    print "👤 Setting up admin user..." $BLUE
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@enterprise.com').exists() or User.objects.create_superuser('admin@enterprise.com', 'admin', 'Enterprise123!')" | python manage.py shell
    
    cd ..
    print "✅ Django setup completed!" $GREEN
}

# Start Django server
start_django() {
    print "🚀 Starting Django API..." $YELLOW
    cd django-api
    source venv/bin/activate
    python manage.py runserver 0.0.0.0:8000 &
    DJANGO_PID=$!
    cd ..
    
    sleep 2
    if curl -s http://localhost:8000 >/dev/null; then
        print "✅ Django API running!" $GREEN
        print "📱 API: http://localhost:8000" $BLUE
        print "🔧 Admin: http://localhost:8000/admin/" $BLUE
        echo $DJANGO_PID > /tmp/django.pid
        return 0
    else
        print "❌ Django failed to start" $RED
        return 1
    fi
}

# Setup npm dependencies (with timeout protection)
setup_npm() {
    print_header
    print "📦 Setting up npm dependencies..." $YELLOW
    
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
        print "⏳ Installing npm dependencies (this may take 5-10 minutes)..." $BLUE
        print "💡 You can press Ctrl+C and run './dev.sh backend' to use only Django" $CYAN
        
        # Install with timeout
        timeout 300 npm install || {
            print "⚠️ npm install incomplete. Frontend apps may not work." $YELLOW
            print "💡 Run 'npm install' manually when you have time" $CYAN
            return 1
        }
        print "✅ npm dependencies installed!" $GREEN
    else
        print "✅ npm dependencies already available" $GREEN
    fi
}

# Try to start frontend (with Nx monorepo support)
start_frontend() {
    local name=$1
    local port=$2
    local path=$3
    local project_name=$4
    
    print "🚀 Starting $name..." $YELLOW
    
    # Check if we have root dependencies
    if [ ! -f "node_modules/.package-lock.json" ]; then
        print "⚠️ Dependencies incomplete for $name" $YELLOW
        return 1
    fi
    
    # For Nx monorepo, use nx serve
    if [ -n "$project_name" ]; then
        print "📦 Using Nx to start $project_name..." $BLUE
        timeout 30 npx nx serve "$project_name" 2>/dev/null &
        PID=$!
        sleep 15
    else
        # Fallback to directory-based approach
        cd "$path"
        
        # Try npm start
        if [ -f "package.json" ]; then
            timeout 10 npm start 2>/dev/null &
            PID=$!
            sleep 8
        else
            cd ..
            return 1
        fi
        
        cd ..
    fi
    
    if curl -s "http://localhost:$port" >/dev/null; then
        print "✅ $name started!" $GREEN
        print "📱 $name: http://localhost:$port" $BLUE
        echo $PID > "/tmp/frontend_$(echo $name | tr ' ' '_').pid"
        return 0
    else
        kill $PID 2>/dev/null || true
        return 1
    fi
}

# Show service status
show_status() {
    print_header
    print "📊 Service Status:" $YELLOW
    
    # Check Django
    if curl -s http://localhost:8000 >/dev/null; then
        print "✅ Django API:      http://localhost:8000" $GREEN
        print "✅ Django Admin:    http://localhost:8000/admin/" $GREEN
    else
        print "❌ Django API:      Not running" $RED
    fi
    
    # Check Angular
    if curl -s http://localhost:4200 >/dev/null; then
        print "✅ Angular Shell:   http://localhost:4200" $GREEN
    else
        print "❌ Angular Shell:   Not running" $RED
    fi
    
    # Check React
    if curl -s http://localhost:4201 >/dev/null; then
        print "✅ React Analytics: http://localhost:4201" $GREEN
    else
        print "❌ React Analytics: Not running" $RED
    fi
}

# Stop all services
stop_all() {
    print_header
    print "🛑 Stopping all services..." $YELLOW
    
    # Stop Django
    if [ -f "/tmp/django.pid" ]; then
        kill $(cat /tmp/django.pid) 2>/dev/null || true
        rm /tmp/django.pid
    fi
    pkill -f "manage.py runserver" 2>/dev/null || true
    
    # Stop frontends
    for pidfile in /tmp/frontend_*.pid; do
        if [ -f "$pidfile" ]; then
            kill $(cat "$pidfile") 2>/dev/null || true
            rm "$pidfile"
        fi
    done
    
    # Clean any remaining processes
    pkill -f "ng serve" 2>/dev/null || true
    pkill -f "npm start" 2>/dev/null || true
    
    print "✅ All services stopped!" $GREEN
}

# Main execution
case "${1:-help}" in
    "quick")
        print_header
        if start_django_quick; then
            print "\n🎉 Django API is ready!" $GREEN
            print "\n🔑 Credentials:" $YELLOW
            print "   Email: admin@enterprise.com" $BLUE
            print "   Password: Enterprise123!" $BLUE
            print "\n💡 Use './dev.sh stop' to stop" $CYAN
        else
            exit 1
        fi
        ;;
        
    "backend")
        setup_django_full
        if start_django; then
            print "\n🎉 Backend is ready!" $GREEN
        fi
        ;;
        
    "frontend")
        if setup_npm; then
            print "\n🚀 Starting frontend applications..." $YELLOW
            start_frontend "Angular Shell" 4200 "" "angular-shell"
            start_frontend "React Analytics" 4201 "" "react-analytics-react-analytics"
        fi
        ;;
        
    "full")
        setup_django_full
        if start_django; then
            print "\n🚀 Setting up frontend..." $YELLOW
            if setup_npm; then
                start_frontend "Angular Shell" 4200 "" "angular-shell"
                start_frontend "React Analytics" 4201 "" "react-analytics-react-analytics"
            fi
        fi
        
        print_header
        print "🎉 Development Environment Ready!" $GREEN
        show_status
        print "\n🔑 Django Credentials:" $YELLOW
        print "   Email: admin@enterprise.com" $BLUE
        print "   Password: Enterprise123!" $BLUE
        print "\n💡 Press Ctrl+C to stop all services" $CYAN
        
        # Cleanup on exit
        trap stop_all SIGINT SIGTERM
        wait
        ;;
        
    "status")
        show_status
        ;;
        
    "stop")
        stop_all
        ;;
        
    "clean")
        print_header
        print "🧹 Cleaning all caches..." $YELLOW
        rm -rf node_modules/
        rm -rf django-api/venv/
        rm -rf dist/
        rm -rf .nx/cache
        rm -f /tmp/*.pid
        print "✅ Cleanup completed!" $GREEN
        ;;
        
    "help"|"-h"|"--help")
        show_usage
        ;;
        
    *)
        print "❌ Unknown command: $1" $RED
        print "Use './dev.sh help' for usage information" $YELLOW
        exit 1
        ;;
esac