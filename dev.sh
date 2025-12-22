#!/bin/bash

# Enterprise Dashboard - Modern Development Launcher
# Author: Senior Architect
# Description: Levanta todo el proyecto de micro-frontends de forma confiable

set -euo pipefail

# Colors usando códigos ANSI modernos
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly MAGENTA='\033[0;35m'
readonly BOLD='\033[1m'
readonly NC='\033[0m'

# Configuración de puertos
readonly DJANGO_PORT=8000
readonly ANGULAR_PORT=4200
readonly REACT_PORT=4201

# Directorios
readonly PROJECT_ROOT="$(pwd)"
readonly DJANGO_DIR="$PROJECT_ROOT/django-api"
readonly ANGULAR_DIR="$PROJECT_ROOT/angular-shell"
readonly REACT_DIR="$PROJECT_ROOT/react-analytics/react-analytics"

# PIDs para tracking
DJANGO_PID=""
ANGULAR_PID=""
REACT_PID=""

# Logging moderno
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${CYAN}[$timestamp] ℹ️  INFO:${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[$timestamp] ✅ SUCCESS:${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[$timestamp] ⚠️  WARNING:${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[$timestamp] ❌ ERROR:${NC} $message"
            ;;
        "HEADER")
            echo -e "\n${BOLD}${MAGENTA}==== $message ====${NC}"
            ;;
    esac
}

# Función para verificar dependencias usando ripgrep
check_dependencies() {
    log "HEADER" "🔍 VERIFICANDO DEPENDENCIAS"
    
    local missing_deps=()
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    else
        log "SUCCESS" "Node.js $(node --version)"
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    else
        log "SUCCESS" "npm $(npm --version)"
    fi
    
    # Verificar Python
    if ! command -v python3 &> /dev/null; then
        missing_deps+=("python3")
    else
        log "SUCCESS" "Python $(python3 --version)"
    fi
    
    # Verificar herramientas modernas
    if ! command -v rg &> /dev/null; then
        log "WARN" "ripgrep no encontrado. Usa: brew install ripgrep"
    fi
    
    if [[ ${#missing_deps[@]} -ne 0 ]]; then
        log "ERROR" "Faltan dependencias: ${missing_deps[*]}"
        log "INFO" "Instalalas primero y después volvé a ejecutar este script"
        exit 1
    fi
    
    log "SUCCESS" "✨ Todas las dependencias críticas están instaladas"
}

# Verificar si un puerto está en uso
is_port_in_use() {
    local port=$1
    if lsof -i :"$port" -t &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Liberar puerto si está ocupado
free_port() {
    local port=$1
    if is_port_in_use "$port"; then
        log "WARN" "Puerto $port está en uso. Liberando..."
        lsof -ti :"$port" | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Instalar dependencias de Node.js
install_node_deps() {
    log "HEADER" "📦 INSTALANDO DEPENDENCIAS DE NODE"
    
    if [[ ! -d "node_modules" ]] || [[ ! -f "node_modules/.package-lock.json" ]]; then
        log "INFO" "Instalando dependencias principales..."
        npm install --silent
        log "SUCCESS" "Dependencias principales instaladas"
    else
        log "INFO" "Dependencias principales ya existen"
    fi
    
    # Instalar dependencias específicas de Angular si es necesario
    if [[ ! -d "$ANGULAR_DIR/node_modules" ]]; then
        log "INFO" "Instalando dependencias de Angular..."
        cd "$ANGULAR_DIR" && npm install --silent && cd "$PROJECT_ROOT"
        log "SUCCESS" "Dependencias de Angular instaladas"
    fi
    
    # Instalar dependencias específicas de React si es necesario
    if [[ ! -d "$REACT_DIR/node_modules" ]]; then
        log "INFO" "Instalando dependencias de React..."
        cd "$REACT_DIR" && npm install --silent && cd "$PROJECT_ROOT"
        log "SUCCESS" "Dependencias de React instaladas"
    fi
}

# Configurar entorno Python/Django
setup_python_env() {
    log "HEADER" "🐍 CONFIGURANDO ENTORNO PYTHON"
    
    cd "$DJANGO_DIR"
    
    # Crear virtual environment si no existe
    if [[ ! -d "venv" ]]; then
        log "INFO" "Creando virtual environment..."
        python3 -m venv venv
    fi
    
    # Activar y actualizar pip
    source venv/bin/activate
    
    # Instalar/actualizar dependencias
    if [[ -f "requirements.txt" ]]; then
        log "INFO" "Instalando dependencias de Python..."
        pip install -r requirements.txt --quiet
    fi
    
    # Correr migraciones
    log "INFO" "Corriendo migraciones de Django..."
    python manage.py migrate --no-input
    
    # Crear superusuario si no existe
    log "INFO" "Configurando usuario admin..."
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@enterprise.com').exists() or User.objects.create_superuser('admin@enterprise.com', 'admin', 'Enterprise123!')" | python manage.py shell
    
    cd "$PROJECT_ROOT"
    log "SUCCESS" "Entorno Python configurado"
}

# Iniciar Django API
start_django() {
    log "HEADER" "🚀 INICIANDO DJANGO API"
    
    free_port $DJANGO_PORT
    
    cd "$DJANGO_DIR"
    source venv/bin/activate
    
    log "INFO" "Iniciando servidor Django en puerto $DJANGO_PORT..."
    python manage.py runserver 0.0.0.0:$DJANGO_PORT > "$PROJECT_ROOT/.django.log" 2>&1 &
    DJANGO_PID=$!
    
    cd "$PROJECT_ROOT"
    
    # Esperar y verificar
    sleep 3
    if is_port_in_use $DJANGO_PORT; then
        log "SUCCESS" "Django API corriendo (PID: $DJANGO_PID) en http://localhost:$DJANGO_PORT"
        log "INFO" "🔧 Django Admin: http://localhost:$DJANGO_PORT/admin/"
    else
        log "ERROR" "Django no pudo iniciarse. Revisa .django.log"
        cat "$PROJECT_ROOT/.django.log" | tail -20
        exit 1
    fi
}

# Iniciar Angular Shell
start_angular() {
    log "HEADER" "🚀 INICIANDO ANGULAR SHELL"
    
    free_port $ANGULAR_PORT
    
    cd "$ANGULAR_DIR"
    
    log "INFO" "Iniciando Angular en puerto $ANGULAR_PORT..."
    npx nx serve angular-shell --port $ANGULAR_PORT > "$PROJECT_ROOT/.angular.log" 2>&1 &
    ANGULAR_PID=$!
    
    cd "$PROJECT_ROOT"
    
    # Esperar y verificar
    sleep 15  # Angular necesita más tiempo para compilar con Nx
    if is_port_in_use $ANGULAR_PORT; then
        log "SUCCESS" "Angular Shell corriendo (PID: $ANGULAR_PID) en http://localhost:$ANGULAR_PORT"
    else
        log "ERROR" "Angular no pudo iniciarse. Revisa .angular.log"
        cat "$PROJECT_ROOT/.angular.log" | tail -20
        exit 1
    fi
}

# Iniciar React Analytics
start_react() {
    log "HEADER" "🚀 INICIANDO REACT ANALYTICS"
    
    free_port $REACT_PORT
    
    cd "$REACT_DIR"
    
    log "INFO" "Iniciando React Analytics en puerto $REACT_PORT..."
    npx nx serve react-analytics-react-analytics --port=$REACT_PORT > "$PROJECT_ROOT/.react.log" 2>&1 &
    REACT_PID=$!
    
    cd "$PROJECT_ROOT"
    
    # Esperar y verificar
    sleep 6
    if is_port_in_use $REACT_PORT; then
        log "SUCCESS" "React Analytics corriendo (PID: $REACT_PID) en http://localhost:$REACT_PORT"
    else
        log "ERROR" "React no pudo iniciarse. Revisa .react.log"
        cat "$PROJECT_ROOT/.react.log" | tail -20
        exit 1
    fi
}

# Mostrar estado final
show_status() {
    log "HEADER" "🎉 SERVICIOS INICIADOS"
    
    echo
    echo -e "${BOLD}${GREEN}📱 ACCESO RÁPIDO:${NC}"
    echo -e "   • Angular Shell: ${BLUE}http://localhost:$ANGULAR_PORT${NC}"
    echo -e "   • React Analytics: ${BLUE}http://localhost:$REACT_PORT${NC}"
    echo -e "   • Django API: ${BLUE}http://localhost:$DJANGO_PORT${NC}"
    echo -e "   • Django Admin: ${BLUE}http://localhost:$DJANGO_PORT/admin/${NC}"
    echo
    echo -e "${BOLD}${YELLOW}🔑 CREDENCIALES POR DEFECTO:${NC}"
    echo -e "   • Email: ${CYAN}admin@enterprise.com${NC}"
    echo -e "   • Password: ${CYAN}Enterprise123!${NC}"
    echo
    echo -e "${BOLD}${MAGENTA}💡 COMANDOS ÚTILES:${NC}"
    echo -e "   • Ver logs: ${CYAN}tail -f .django.log .angular.log .react.log${NC}"
    echo -e "   • Detener todo: ${CYAN}./dev.sh stop${NC}"
    echo -e "   • Ver estado: ${CYAN}./dev.sh status${NC}"
    echo
    echo -e "${BOLD}${GREEN}⚡ Micro-frontend architecture running!${NC}"
    echo
}

# Limpieza al salir
cleanup() {
    echo
    log "WARN" "Deteniendo todos los servicios..."
    
    # Matar procesos por PID
    [[ -n "$DJANGO_PID" ]] && kill "$DJANGO_PID" 2>/dev/null || true
    [[ -n "$ANGULAR_PID" ]] && kill "$ANGULAR_PID" 2>/dev/null || true
    [[ -n "$REACT_PID" ]] && kill "$REACT_PID" 2>/dev/null || true
    
    # Matar por puerto (fallback)
    free_port $DJANGO_PORT
    free_port $ANGULAR_PORT
    free_port $REACT_PORT
    
    # Limpiar logs
    rm -f .django.log .angular.log .react.log
    
    log "SUCCESS" "Todos los servicios detenidos"
    exit 0
}

# Mostrar ayuda
show_help() {
    cat << 'EOF'
🎯 Enterprise Dashboard - Development Launcher

USO:
    ./dev.sh [COMANDO]

COMANDOS:
    start           Inicia todos los servicios (default)
    stop            Detiene todos los servicios
    restart         Reinicia todos los servicios
    status          Muestra el estado de los servicios
    logs            Muestra los logs en tiempo real
    clean           Limpia caches y dependencias
    help            Muestra esta ayuda

EJEMPLOS:
    ./dev.sh                # Inicia todo
    ./dev.sh stop           # Detiene todo
    ./dev.sh restart        # Reinicia todo
    ./dev.sh logs           # Ver logs vivos

EOF
}

# Mostrar estado
show_services_status() {
    log "HEADER" "📊 ESTADO DE SERVICIOS"
    
    echo
    if is_port_in_use $DJANGO_PORT; then
        echo -e "${GREEN}✅ Django API ($DJANGO_PORT): RUNNING${NC}"
    else
        echo -e "${RED}❌ Django API ($DJANGO_PORT): STOPPED${NC}"
    fi
    
    if is_port_in_use $ANGULAR_PORT; then
        echo -e "${GREEN}✅ Angular Shell ($ANGULAR_PORT): RUNNING${NC}"
    else
        echo -e "${RED}❌ Angular Shell ($ANGULAR_PORT): STOPPED${NC}"
    fi
    
    if is_port_in_use $REACT_PORT; then
        echo -e "${GREEN}✅ React Analytics ($REACT_PORT): RUNNING${NC}"
    else
        echo -e "${RED}❌ React Analytics ($REACT_PORT): STOPPED${NC}"
    fi
    echo
}

# Mostrar logs
show_logs() {
    log "INFO" "Mostrando logs (Ctrl+C para salir)..."
    trap 'echo; log "INFO" "Logs cerrados"' EXIT
    
    tail -f .django.log .angular.log .react.log 2>/dev/null || {
        log "WARN" "No se encontraron logs. Iniciá los servicios primero."
    }
}

# Limpiar proyecto
clean_project() {
    log "HEADER" "🧹 LIMPIANDO PROYECTO"
    
    log "INFO" "Deteniendo servicios..."
    cleanup 2>/dev/null || true
    
    log "INFO" "Eliminando node_modules..."
    rm -rf node_modules/ "$ANGULAR_DIR/node_modules" "$REACT_DIR/node_modules"
    
    log "INFO" "Eliminando caches de Nx..."
    rm -rf .nx/cache
    
    log "INFO" "Eliminando logs temporales..."
    rm -f .django.log .angular.log .react.log
    
    log "SUCCESS" "Proyecto limpiado. Ejecutá ./dev.sh para empezar de cero."
}

# MAIN - Lógica principal
main() {
    # Configurar traps para limpieza
    trap cleanup SIGINT SIGTERM
    
    case "${1:-start}" in
        "start"|"dev"|"")
            log "HEADER" "🎯 ENTERPRISE DASHBOARD - INICIANDO"
            check_dependencies
            install_node_deps
            setup_python_env
            start_django
            start_angular
            start_react
            show_status
            log "INFO" "Script corriendo. Presioná Ctrl+C para detener todo."
            wait
            ;;
        "stop")
            cleanup
            ;;
        "restart")
            log "INFO" "Reiniciando servicios..."
            cleanup
            sleep 2
            main "start"
            ;;
        "status")
            show_services_status
            ;;
        "logs")
            show_logs
            ;;
        "clean")
            clean_project
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log "ERROR" "Comando desconocido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar main con todos los argumentos
main "$@"