@echo off
REM Enterprise Dashboard - Windows Development Scripts
REM Compatible with Windows 10/11 with Node.js and Python 3.8+

setlocal enabledelayedexpansion

REM Variables
set "NODE_REQUIRED=14.0.0"
set "PYTHON_REQUIRED=3.8.0"
set "ANGULAR_PORT=4200"
set "REACT_PORT=4201"
set "DJANGO_PORT=8000"

REM Colors for Windows (limited support)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

:main
if "%1"=="" goto start
if "%1"=="start" goto start
if "%1"=="dev" goto start
if "%1"=="stop" goto stop
if "%1"=="build" goto build
if "%1"=="status" goto status
if "%1"=="clean" goto clean
if "%1"=="help" goto help
if "%1"=="-h" goto help
if "%1"=="--help" goto help

echo %ERROR% Unknown command: %1
echo Use 'start-services.bat help' for usage information.
exit /b 1

:header
echo.
echo ================================================================
echo   Enterprise Dashboard - Micro-frontend Development
echo ================================================================
exit /b

:check_dependencies
echo %INFO% Checking dependencies...

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo %SUCCESS% Node.js: !NODE_VERSION!
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% npm is not installed or not in PATH
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo %SUCCESS% npm: !NPM_VERSION!
)

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org/
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo %SUCCESS% Python: !PYTHON_VERSION!
)

echo %SUCCESS% All dependencies found!
exit /b

:install_npm_deps
echo.
echo %INFO% Installing npm dependencies...
npm install
if errorlevel 1 (
    echo %ERROR% Failed to install npm dependencies
    exit /b 1
) else (
    echo %SUCCESS% npm dependencies installed!
)
exit /b

:setup_python_env
echo.
echo %INFO% Setting up Python environment...

cd django-api

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo %INFO% Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo %ERROR% Failed to create virtual environment
        cd ..
        exit /b 1
    )
    echo %SUCCESS% Virtual environment created!
)

REM Activate and install requirements
echo %INFO% Installing Python requirements...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo %ERROR% Failed to install Python requirements
    cd ..
    exit /b 1
)

cd ..
echo %SUCCESS% Python environment ready!
exit /b

:start
call :header
call :check_dependencies
if errorlevel 1 exit /b 1

call :install_npm_deps
if errorlevel 1 exit /b 1

call :setup_python_env
if errorlevel 1 exit /b 1

echo.
echo %INFO% Starting all services...
echo %WARNING% This will take a moment...

REM Start Django API in background
echo %INFO% Starting Django API...
cd django-api
start "Django API" cmd /k "venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"
cd ..
timeout /t 3 /nobreak >nul

REM Start Angular Shell in background
echo %INFO% Starting Angular Shell...
cd angular-shell
start "Angular Shell" cmd /k "npx ng serve"
cd ..
timeout /t 5 /nobreak >nul

REM Start React Analytics in background
echo %INFO% Starting React Analytics...
start "React Analytics" cmd /k "npx nx serve react-analytics-react-analytics"

REM Show status after delay
timeout /t 5 /nobreak >nul
call :show_status
exit /b

:show_status
echo.
echo ================================================================
echo   🎉 ALL SERVICES RUNNING!
echo ================================================================
echo.
echo 📱 Access your applications:
echo    • Angular Shell: http://localhost:%ANGULAR_PORT%
echo    • React Analytics: http://localhost:%REACT_PORT%
echo    • Django API: http://localhost:%DJANGO_PORT%
echo    • Django Admin: http://localhost:%DJANGO_PORT%/admin/
echo.
echo 🔑 Default credentials:
echo    Email: admin@enterprise.com
echo    Password: Enterprise123!
echo.
echo 💡 Close this window to stop all services
echo ================================================================
echo.
pause
exit /b

:stop
echo.
echo %INFO% Stopping all services...

REM Kill processes by name
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

REM Alternative: Kill by port (requires netstat and findstr)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%ANGULAR_PORT% ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%REACT_PORT% ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%DJANGO_PORT% ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo %SUCCESS% All services stopped!
exit /b

:build
echo.
echo %INFO% Building all applications...
npm run build
if errorlevel 1 (
    echo %ERROR% Build failed
    exit /b 1
) else (
    echo %SUCCESS% Build completed!
)
exit /b

:status
call :header
echo %INFO% Checking service status...

REM Check if ports are in use
netstat -aon | findstr :%ANGULAR_PORT% | findstr LISTENING >nul
if errorlevel 1 (
    echo ❌ Angular Shell (%ANGULAR_PORT%): Not running
) else (
    echo ✅ Angular Shell (%ANGULAR_PORT%): Running
)

netstat -aon | findstr :%REACT_PORT% | findstr LISTENING >nul
if errorlevel 1 (
    echo ❌ React Analytics (%REACT_PORT%): Not running
) else (
    echo ✅ React Analytics (%REACT_PORT%): Running
)

netstat -aon | findstr :%DJANGO_PORT% | findstr LISTENING >nul
if errorlevel 1 (
    echo ❌ Django API (%DJANGO_PORT%): Not running
) else (
    echo ✅ Django API (%DJANGO_PORT%): Running
)
exit /b

:clean
echo.
echo %INFO% Cleaning up...

REM Remove node_modules
if exist "node_modules" (
    rmdir /s /q node_modules
    echo %INFO% Removed node_modules
)

REM Remove Python venv
if exist "django-api\venv" (
    rmdir /s /q django-api\venv
    echo %INFO% Removed Python virtual environment
)

REM Remove dist folders
if exist "dist" (
    rmdir /s /q dist
    echo %INFO% Removed dist folders
)

REM Remove Nx cache
if exist ".nx" (
    rmdir /s /q .nx
    echo %INFO% Removed Nx cache
)

echo %SUCCESS% Cleanup completed!
exit /b

:help
call :header
echo 📖 Usage:
echo   start-services.bat [command]
echo.
echo 🚀 Commands:
echo   start, dev          Start all development services
echo   stop                 Stop all running services
echo   status               Check service status
echo   build                Build all applications
echo   clean                Clean all caches and dependencies
echo   help, -h, --help     Show this help message
echo.
echo 💡 Quick start:
echo   start-services.bat
echo   or: npm run dev
echo.
echo 🔧 Requirements:
echo   - Node.js 14+ with npm
echo   - Python 3.8+ with pip
echo   - Windows 10/11
echo.
echo 📝 Notes:
echo   - Services start in separate command windows
echo   - Close the main window to stop all services
echo   - Use Ctrl+C in individual windows to stop specific services
exit /b