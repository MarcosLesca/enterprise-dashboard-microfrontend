@echo off
REM Enterprise Dashboard - Windows Development Script
REM Fixed version that actually works on Windows properly

setlocal enabledelayedexpansion

REM Configuration
set "PROJECT_NAME=Enterprise Dashboard"
set "ANGULAR_PORT=4200"
set "REACT_PORT=4201"
set "DJANGO_PORT=8000"
set "LOG_FILE=deploy.log"

REM Enable ANSI colors on Windows 10+
reg query HKCU\CONSOLE /v VirtualTerminalLevel 2>nul || (
    reg add HKCU\CONSOLE /v VirtualTerminalLevel /t REG_DWORD /d 1 /f >nul 2>&1
)

REM Color codes
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "BOLD=[1m"
set "NC=[0m"

REM Logging function
log() {
    echo %1
    echo %date% %time% - %1 >> %LOG_FILE%
}

print() {
    echo %CYAN%%1%NC%
    log %1
}

print_success() {
    echo %GREEN%%1%NC%
    log %1
}

print_error() {
    echo %RED%%1%NC%
    log %1
}

print_warning() {
    echo %YELLOW%%1%NC%
    log %1
}

print_header() {
    echo.
    echo %BOLD%%CYAN%🚀 %PROJECT_NAME% - Windows Development%NC%
    echo %CYAN%================================================%NC%
}

REM Function to check if command exists
command_exists() {
    where %1 >nul 2>&1
    if %errorlevel% equ 0 (
        exit /b 0
    ) else (
        exit /b 1
    )
}

REM Function to check if port is in use
check_port() {
    netstat -an | findstr ":%1" | findstr "LISTENING" >nul
    if %errorlevel% equ 0 (
        exit /b 0
    ) else (
        exit /b 1
    )
}

REM Function to kill process by port
kill_port() {
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%1" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
}

REM Function to check dependencies
check_dependencies() {
    print_header
    print "🔍 Checking dependencies..."
    
    REM Check Node.js
    command_exists node
    if %errorlevel% neq 0 (
        print_error "❌ Node.js is not installed or not in PATH"
        print "Please install Node.js from https://nodejs.org/"
        exit /b 1
    ) else (
        for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
        print_success "✅ Node.js: !NODE_VERSION!"
    )
    
    REM Check npm
    command_exists npm
    if %errorlevel% neq 0 (
        print_error "❌ npm is not installed or not in PATH"
        exit /b 1
    ) else (
        for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
        print_success "✅ npm: !NPM_VERSION!"
    )
    
    REM Check Python
    command_exists python
    if %errorlevel% neq 0 (
        print_error "❌ Python is not installed or not in PATH"
        print "Please install Python 3.8+ from https://python.org/"
        exit /b 1
    ) else (
        for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
        print_success "✅ Python: !PYTHON_VERSION!"
    )
    
    print_success "✅ All dependencies found!"
}

REM Function to install npm dependencies
install_npm_deps() {
    print.
    print "📦 Installing npm dependencies..."
    
    if not exist "node_modules\.package-lock.json" (
        npm install
        if %errorlevel% neq 0 (
            print_error "❌ Failed to install npm dependencies"
            exit /b 1
        ) else (
            print_success "✅ npm dependencies installed!"
        )
    ) else (
        print_success "✅ npm dependencies already available"
    )
}

REM Function to setup Python environment
setup_python_env() {
    print.
    print "🐍 Setting up Python environment..."
    
    cd django-api
    
    REM Create virtual environment if it doesn't exist
    if not exist "venv" (
        print "📦 Creating virtual environment..."
        python -m venv venv
        if %errorlevel% neq 0 (
            print_error "❌ Failed to create virtual environment"
            cd ..
            exit /b 1
        )
        print_success "✅ Virtual environment created!"
    )
    
    REM Activate and install requirements
    print "📦 Installing Python requirements..."
    call venv\Scripts\activate.bat
    
    REM Check if requirements are installed
    pip show django >nul 2>&1
    if %errorlevel% neq 0 (
        pip install -r requirements.txt
        if %errorlevel% neq 0 (
            print_error "❌ Failed to install Python requirements"
            cd ..
            exit /b 1
        )
    )
    
    REM Run migrations
    print "🗄️ Running database migrations..."
    python manage.py migrate
    
    REM Create superuser if doesn't exist
    print "👤 Setting up admin user..."
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@enterprise.com').exists() or User.objects.create_superuser('admin@enterprise.com', 'admin', 'Enterprise123!')" | python manage.py shell
    
    cd ..
    print_success "✅ Python environment ready!"
}

REM Function to start Django API
start_django() {
    print.
    print "🚀 Starting Django API..."
    
    cd django-api
    start /B "" cmd /c "venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:%DJANGO_PORT% > ../django.log 2>&1"
    cd ..
    
    REM Wait a bit and check if it's running
    timeout /t 5 /nobreak >nul
    check_port %DJANGO_PORT%
    if %errorlevel% equ 0 (
        print_success "✅ Django API started!"
        print "📱 API: http://localhost:%DJANGO_PORT%"
        print "🔧 Admin: http://localhost:%DJANGO_PORT%/admin/"
    ) else (
        print_error "❌ Django API failed to start"
        print "🔍 Check django.log for details"
        exit /b 1
    )
}

REM Function to start Angular Shell
start_angular() {
    print.
    print "🚀 Starting Angular Shell..."
    
    cd angular-shell
    start /B "" cmd /c "npm start > ../angular.log 2>&1"
    cd ..
    
    REM Wait a bit and check if it's running
    timeout /t 15 /nobreak >nul
    check_port %ANGULAR_PORT%
    if %errorlevel% equ 0 (
        print_success "✅ Angular Shell started!"
        print "📱 Angular Shell: http://localhost:%ANGULAR_PORT%"
    ) else (
        print_error "❌ Angular Shell failed to start"
        print "🔍 Check angular.log for details"
        exit /b 1
    )
}

REM Function to start React Analytics
start_react() {
    print.
    print "🚀 Starting React Analytics..."
    
    cd react-analytics\react-analytics
    start /B "" cmd /c "npm run dev > ..\..\react.log 2>&1"
    cd ..\..
    
    REM Wait a bit and check if it's running
    timeout /t 15 /nobreak >nul
    check_port %REACT_PORT%
    if %errorlevel% equ 0 (
        print_success "✅ React Analytics started!"
        print "📱 React Analytics: http://localhost:%REACT_PORT%"
    ) else (
        print_error "❌ React Analytics failed to start"
        print "🔍 Check react.log for details"
        exit /b 1
    )
}

REM Function to stop all services
stop_all() {
    print_header
    print "🛑 Stopping all services..."
    
    REM Kill processes by port
    kill_port %ANGULAR_PORT%
    kill_port %REACT_PORT%
    kill_port %DJANGO_PORT%
    
    REM Kill by process name (more aggressive)
    taskkill /F /IM node.exe >nul 2>&1
    taskkill /F /IM python.exe >nul 2>&1
    
    REM Clean up log files
    if exist "django.log" del "django.log"
    if exist "angular.log" del "angular.log"
    if exist "react.log" del "react.log"
    
    print_success "✅ All services stopped!"
}

REM Function to show service status
show_status() {
    print_header
    print "📊 Service Status:"
    
    REM Check Django
    check_port %DJANGO_PORT%
    if %errorlevel% equ 0 (
        print_success "✅ Django API:      http://localhost:%DJANGO_PORT%"
        print_success "✅ Django Admin:    http://localhost:%DJANGO_PORT%/admin/"
    ) else (
        print_error "❌ Django API:      Not running"
    )
    
    REM Check Angular
    check_port %ANGULAR_PORT%
    if %errorlevel% equ 0 (
        print_success "✅ Angular Shell:   http://localhost:%ANGULAR_PORT%"
    ) else (
        print_error "❌ Angular Shell:   Not running"
    )
    
    REM Check React
    check_port %REACT_PORT%
    if %errorlevel% equ 0 (
        print_success "✅ React Analytics: http://localhost:%REACT_PORT%"
    ) else (
        print_error "❌ React Analytics: Not running"
    )
}

REM Function to clean up
cleanup() {
    print_header
    print "🧹 Cleaning up..."
    
    REM Stop services first
    call :stop_all
    
    REM Remove directories
    if exist "node_modules" (
        rmdir /s /q node_modules
        print "📦 Removed node_modules"
    )
    
    if exist "django-api\venv" (
        rmdir /s /q django-api\venv
        print "🐍 Removed Python virtual environment"
    )
    
    if exist "dist" (
        rmdir /s /q dist
        print "🏗️ Removed dist folders"
    )
    
    if exist ".nx" (
        rmdir /s /q .nx
        print "🧹 Removed Nx cache"
    )
    
    print_success "✅ Cleanup completed!"
}

REM Main execution logic
if "%1"=="" goto start
if "%1"=="start" goto start
if "%1"=="dev" goto start
if "%1"=="development" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="clean" goto cleanup
if "%1"=="cleanup" goto cleanup
if "%1"=="help" goto help
if "%1"=="-h" goto help
if "%1"=="--help" goto help

print_error "❌ Unknown command: %1"
print "Use 'start-services.bat help' for usage information."
exit /b 1

:start
call :check_dependencies
if %errorlevel% neq 0 exit /b 1

call :install_npm_deps
if %errorlevel% neq 0 exit /b 1

call :setup_python_env
if %errorlevel% neq 0 exit /b 1

print.
print "🚀 Starting all services..."
print_warning "⏳ This will take a moment..."

call :start_django
call :start_angular
call :start_react

print_header
print_success "🎉 ALL SERVICES RUNNING!"
print.
print "📱 Access your applications:"
print "   • Angular Shell: http://localhost:%ANGULAR_PORT%"
print "   • React Analytics: http://localhost:%REACT_PORT%"
print "   • Django API: http://localhost:%DJANGO_PORT%"
print "   • Django Admin: http://localhost:%DJANGO_PORT%/admin/"
print.
print "🔑 Default credentials:"
print "   Email: admin@enterprise.com"
print "   Password: Enterprise123!"
print.
print_warning "💡 Use 'start-services.bat stop' to stop all services"
print_warning "💡 Use 'start-services.bat status' to check service status"
goto end

:stop
call :stop_all
goto end

:status
call :show_status
goto end

:cleanup
call :cleanup
goto end

:help
print_header
print "📖 Usage:"
print "  start-services.bat [command]"
print.
print "🚀 Commands:"
print "  start, dev, development  Start all development services"
print "  stop                      Stop all running services"
print "  status                    Check service status"
print "  cleanup, clean            Clean all caches and dependencies"
print "  help, -h, --help          Show this help message"
print.
print "💡 Quick start:"
print "  start-services.bat"
print "  or: npm run dev"
print.
print "🔧 Requirements:"
print "   - Node.js 14+ with npm"
print "   - Python 3.8+ with pip"
print "   - Windows 10/11"
print.
print "📝 Notes:"
print "   - Services run in background"
print "   - Check log files (*.log) if services fail to start"
print "   - Use Ctrl+C in terminal to stop the script"

:end
if "%1"=="start" (
    print.
    print_warning "💡 Press any key to stop all services..."
    pause >nul
    call :stop_all
)

endlocal