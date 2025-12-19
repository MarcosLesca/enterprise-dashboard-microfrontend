@echo off
echo 🚀 Enterprise Dashboard - Windows Production Deployment
echo =====================================================
echo.

echo 🔍 Checking prerequisites...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker check passed!
echo.

echo 🐳 Starting Production Deployment...
echo 1. Building images...
docker-compose -f docker-compose.prod.yml build

echo 2. Starting services...
docker-compose -f docker-compose.prod.yml up -d

echo 3. Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo.
echo 🌐 Access URLs:
echo   Main Application: http://localhost
echo   API: http://localhost/api
echo   Admin: http://localhost/admin/
echo.

echo 🔍 Checking service health...
curl -f http://localhost/api/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ⚠️  Backend may still be starting...
)

curl -f http://localhost >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is healthy
) else (
    echo ⚠️  Frontend may still be starting...
)

echo.
echo 📋 Useful Commands:
echo   View logs: docker-compose -f docker-compose.prod.yml logs -f
echo   Stop services: docker-compose -f docker-compose.prod.yml down
echo   Restart services: docker-compose -f docker-compose.prod.yml restart
echo.
echo Press any key to exit...
pause >nul