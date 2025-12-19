#!/bin/bash

# Enterprise Dashboard - Cross-platform Development Scripts
# Compatible with Linux, macOS, and Windows (WSL/Git Bash)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo -e "\n${BOLD}🎯 Enterprise Dashboard - Micro-frontend Development${NC}"
    echo -e "${CYAN}================================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check dependencies
check_dependencies() {
    print_message "\n🔍 Checking dependencies..." $YELLOW
    
    local missing=()
    
    if ! command_exists node; then
        missing+=("Node.js")
    fi
    
    if ! command_exists npm; then
        missing+=("npm")
    fi
    
    if ! command_exists python3; then
        missing+=("Python 3")
    fi
    
    if [ ${#missing[@]} -ne 0 ]; then
        print_message "❌ Missing dependencies: ${missing[*]}" $RED
        print_message "Please install the missing dependencies and try again." $RED
        exit 1
    fi
    
    print_message "✅ All dependencies found!" $GREEN
}

# Function to install npm dependencies
install_npm_deps() {
    print_message "\n📦 Installing npm dependencies..." $YELLOW
    npm install
    print_message "✅ npm dependencies installed!" $GREEN
}

# Function to setup Python environment
setup_python_env() {
    print_message "\n🐍 Setting up Python environment..." $YELLOW
    
    cd django-api
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_message "✅ Virtual environment created!" $GREEN
    fi
    
    # Activate and install requirements
    source venv/bin/activate
    pip install -r requirements.txt
    
    cd ..
    print_message "✅ Python environment ready!" $GREEN
}

# Function to start Django API
start_django() {
    print_message "\n🚀 Starting Django API..." $CYAN
    cd django-api
    source venv/bin/activate
    python manage.py runserver 0.0.0.0:8000 &
    DJANGO_PID=$!
    cd ..
    print_message "✅ Django API started (PID: $DJANGO_PID)!" $GREEN
    print_message "📱 Django API: http://localhost:8000" $BLUE
    print_message "🔧 Django Admin: http://localhost:8000/admin/" $BLUE
}

# Function to start Angular Shell
start_angular() {
    print_message "\n🚀 Starting Angular Shell..." $CYAN
    cd angular-shell
    npx ng serve &
    ANGULAR_PID=$!
    cd ..
    print_message "✅ Angular Shell started (PID: $ANGULAR_PID)!" $GREEN
    print_message "📱 Angular Shell: http://localhost:4200" $BLUE
}

# Function to start React Analytics
start_react() {
    print_message "\n🚀 Starting React Analytics..." $CYAN
    npx nx serve react-analytics-react-analytics &
    REACT_PID=$!
    print_message "✅ React Analytics started (PID: $REACT_PID)!" $GREEN
    print_message "📱 React Analytics: http://localhost:4201" $BLUE
}

# Function to show services status
show_status() {
    sleep 5
    print_header
    print_message "🎉 ALL SERVICES RUNNING!" $BOLD
    print_message "\n📱 Access your applications:" $BLUE
    print_message "   • Angular Shell: http://localhost:4200" $BLUE
    print_message "   • React Analytics: http://localhost:4201" $BLUE
    print_message "   • Django API: http://localhost:8000" $BLUE
    print_message "   • Django Admin: http://localhost:8000/admin/" $BLUE
    print_message "\n🔑 Default credentials:" $YELLOW
    print_message "   Email: admin@enterprise.com" $YELLOW
    print_message "   Password: Enterprise123!" $YELLOW
    print_message "\n💡 Press Ctrl+C to stop all services" $CYAN
    print_message "================================================" $CYAN
}

# Function to stop all services
stop_services() {
    print_message "\n🛑 Stopping all services..." $YELLOW
    
    # Kill processes by port and command
    pkill -f "ng serve" 2>/dev/null || true
    pkill -f "nx serve" 2>/dev/null || true
    pkill -f "manage.py runserver" 2>/dev/null || true
    pkill -f "node.*start-services" 2>/dev/null || true
    
    # Alternative method: kill by port
    lsof -ti:4200 | xargs kill -9 2>/dev/null || true
    lsof -ti:4201 | xargs kill -9 2>/dev/null || true
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    
    print_message "✅ All services stopped!" $GREEN
}

# Function to build all applications
build_all() {
    print_message "\n🔨 Building all applications..." $YELLOW
    npm run build
    print_message "✅ Build completed!" $GREEN
}

# Function to cleanup on exit
cleanup() {
    print_message "\n\n🛑 Shutting down services..." $YELLOW
    stop_services
    exit 0
}

# Main script logic
case "$1" in
    "start"|"dev"|"")
        print_header
        check_dependencies
        install_npm_deps
        setup_python_env
        
        print_message "\n🚀 Starting all services..." $BOLD
        print_message "⏳ This will take a moment..." $YELLOW
        
        # Start services with delays
        start_django
        sleep 2
        start_angular
        sleep 3
        start_react
        
        # Set up signal handlers for graceful shutdown
        trap cleanup SIGINT SIGTERM
        
        show_status
        
        # Keep script running
        wait
        ;;
    "stop")
        stop_services
        ;;
    "build")
        build_all
        ;;
    "status")
        print_header
        print_message "📊 Checking service status..." $YELLOW
        
        # Check if services are running by testing ports
        if curl -s http://localhost:4200 >/dev/null; then
            print_message "✅ Angular Shell (4200): Running" $GREEN
        else
            print_message "❌ Angular Shell (4200): Not running" $RED
        fi
        
        if curl -s http://localhost:4201 >/dev/null; then
            print_message "✅ React Analytics (4201): Running" $GREEN
        else
            print_message "❌ React Analytics (4201): Not running" $RED
        fi
        
        if curl -s http://localhost:8000 >/dev/null; then
            print_message "✅ Django API (8000): Running" $GREEN
        else
            print_message "❌ Django API (8000): Not running" $RED
        fi
        ;;
    "clean")
        print_message "\n🧹 Cleaning up..." $YELLOW
        rm -rf node_modules/
        rm -rf django-api/venv/
        rm -rf dist/
        rm -rf .nx/cache
        print_message "✅ Cleanup completed!" $GREEN
        ;;
    "help"|"-h"|"--help")
        print_header
        print_message "📖 Usage:" $BOLD
        print_message "  ./start-services.sh [command]" $CYAN
        print_message "\n🚀 Commands:" $BOLD
        print_message "  start, dev          Start all development services" $GREEN
        print_message "  stop                 Stop all running services" $GREEN
        print_message "  status               Check service status" $GREEN
        print_message "  build                Build all applications" $GREEN
        print_message "  clean                Clean all caches and dependencies" $GREEN
        print_message "  help, -h, --help     Show this help message" $GREEN
        print_message "\n💡 Quick start:" $YELLOW
        print_message "  ./start-services.sh" $CYAN
        print_message "  or: npm run dev" $CYAN
        ;;
    *)
        print_message "❌ Unknown command: $1" $RED
        print_message "Use './start-services.sh help' for usage information." $YELLOW
        exit 1
        ;;
esac