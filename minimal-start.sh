#!/bin/bash

# Enterprise Dashboard - Minimal Development Script
# Works with incomplete npm installations

set -e

echo "🎯 Enterprise Dashboard - Minimal Start"
echo "======================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print() {
    echo -e "${2}${1}${NC}"
}

# Check if Django is working
start_django() {
    print "\n🚀 Starting Django API..." $YELLOW
    cd django-api
    
    # Setup if needed
    if [ ! -d "venv" ]; then
        print "📦 Creating Python environment..." $BLUE
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -q -r requirements.txt
    
    # Create superuser if doesn't exist
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin@enterprise.com', 'admin', 'Enterprise123!')" | python manage.py shell
    
    # Run migrations
    python manage.py migrate
    
    # Start server
    python manage.py runserver 0.0.0.0:8000 &
    DJANGO_PID=$!
    cd ..
    
    sleep 2
    if curl -s http://localhost:8000 >/dev/null; then
        print "✅ Django API is running!" $GREEN
        print "📱 API: http://localhost:8000" $BLUE
        print "🔧 Admin: http://localhost:8000/admin/" $BLUE
        return 0
    else
        print "❌ Django failed to start" $RED
        return 1
    fi
}

# Try to start frontend with fallbacks
try_start_frontend() {
    local name=$1
    local port=$2
    local path=$3
    
    print "\n🚀 Starting $name..." $YELLOW
    
    cd "$path"
    
    # Method 1: Try npm if available
    if [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
        print "📦 Trying npm start..." $BLUE
        npm start 2>/dev/null &
        PID=$!
        
        sleep 5
        if curl -s "http://localhost:$port" >/dev/null; then
            print "✅ $name started via npm!" $GREEN
            echo $PID > /tmp/frontend_$name.pid
            cd ..
            return 0
        else
            kill $PID 2>/dev/null || true
        fi
    fi
    
    # Method 2: Try global Angular CLI
    if command -v ng >/dev/null 2>&1 && [[ "$name" == *"Angular"* ]]; then
        print "📦 Trying Angular CLI..." $BLUE
        ng serve --port="$port" 2>/dev/null &
        PID=$!
        
        sleep 5
        if curl -s "http://localhost:$port" >/dev/null; then
            print "✅ $name started via Angular CLI!" $GREEN
            echo $PID > /tmp/frontend_$name.pid
            cd ..
            return 0
        else
            kill $PID 2>/dev/null || true
        fi
    fi
    
    # Method 3: Try basic static server if dist exists
    if [ -d "dist" ]; then
        print "📦 Trying static server..." $BLUE
        python3 -m http.server "$port" --directory dist 2>/dev/null &
        PID=$!
        
        sleep 2
        if curl -s "http://localhost:$port" >/dev/null; then
            print "✅ $name started via static server!" $GREEN
            echo $PID > /tmp/frontend_$name.pid
            cd ..
            return 0
        else
            kill $PID 2>/dev/null || true
        fi
    fi
    
    print "⚠️  $name could not be started - npm dependencies may be incomplete" $YELLOW
    print "💡 Try: cd $path && npm install" $BLUE
    cd ..
    return 1
}

# Main execution
print "🔍 System Check:" $YELLOW
print "   Node.js: $(node --version 2>/dev/null || echo 'Not found')" $BLUE
print "   Python3: $(python3 --version)" $BLUE
print "   npm: $(npm --version 2>/dev/null || echo 'Not found')" $BLUE

# Start Django (critical)
if start_django; then
    DJANGO_SUCCESS=true
else
    DJANGO_SUCCESS=false
fi

# Try to start frontends (best effort)
FRONTEND_SUCCESS=false

if [ -d "angular-shell" ]; then
    if try_start_frontend "Angular Shell" 4200 "angular-shell"; then
        FRONTEND_SUCCESS=true
    fi
fi

if [ -d "react-analytics/react-analytics" ]; then
    if try_start_frontend "React Analytics" 4201 "react-analytics/react-analytics"; then
        FRONTEND_SUCCESS=true
    fi
fi

# Show final status
print "\n📊 FINAL STATUS:" $YELLOW
print "=====================================" $BLUE

if [ "$DJANGO_SUCCESS" = true ]; then
    print "✅ Django API:      http://localhost:8000" $GREEN
    print "✅ Django Admin:    http://localhost:8000/admin/" $GREEN
else
    print "❌ Django API:      Failed" $RED
fi

if [ "$FRONTEND_SUCCESS" = true ]; then
    print "✅ Angular Shell:   http://localhost:4200" $GREEN
    print "✅ React Analytics: http://localhost:4201" $GREEN
else
    print "❌ Frontend Apps:   npm dependencies incomplete" $RED
    print "💡 Run 'npm install' to enable frontend apps" $BLUE
fi

print "\n🔑 Django Credentials:" $YELLOW
print "   Email: admin@enterprise.com" $BLUE
print "   Password: Enterprise123!" $BLUE

if [ "$DJANGO_SUCCESS" = true ]; then
    print "\n🎉 Backend is ready for development!" $GREEN
    print "💡 You can test API endpoints even if frontends fail" $BLUE
else
    print "\n❌ Critical services failed to start" $RED
    exit 1
fi

print "\n💡 Press Ctrl+C to stop services" $YELLOW

# Cleanup function
cleanup() {
    print "\n🛑 Stopping services..." $YELLOW
    
    # Kill Django
    pkill -f "manage.py runserver" 2>/dev/null || true
    
    # Kill any frontend processes
    for pidfile in /tmp/frontend_*.pid; do
        if [ -f "$pidfile" ]; then
            kill $(cat "$pidfile") 2>/dev/null || true
            rm "$pidfile"
        fi
    done
    
    print "✅ All services stopped" $GREEN
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait