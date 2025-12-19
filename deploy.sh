#!/bin/bash

# Enterprise Dashboard - Deployment Script
# Handles production deployment across all environments

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"localhost:5000"}
PROJECT_NAME="enterprise-dashboard"
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

print() {
    echo -e "${2}${1}${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ${1}" >> $LOG_FILE
}

print_header() {
    echo -e "\n${BOLD}🚀 Enterprise Dashboard - Deployment${NC}"
    echo -e "${CYAN}=============================================${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_header
    print "🔍 Checking prerequisites..." $YELLOW
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print "❌ Docker is not installed" $RED
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print "❌ Docker Compose is not installed" $RED
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print "❌ Docker is not running" $RED
        exit 1
    fi
    
    print "✅ All prerequisites satisfied" $GREEN
}

# Function to backup existing data
backup_data() {
    if [ "$ENVIRONMENT" = "production" ]; then
        print "💾 Creating backup..." $YELLOW
        
        mkdir -p $BACKUP_DIR
        BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
        
        # Backup database and important files
        docker run --rm -v $(pwd)/django-api:/source -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/backup-temp.tar.gz -C /source data/ db.sqlite3 2>/dev/null || true
        
        if [ -f "$BACKUP_DIR/backup-temp.tar.gz" ]; then
            mv "$BACKUP_DIR/backup-temp.tar.gz" "$BACKUP_FILE"
            print "✅ Backup created: $BACKUP_FILE" $GREEN
        fi
    fi
}

# Function to build and deploy
deploy() {
    print_header
    print "🏗️ Starting deployment to $ENVIRONMENT..." $YELLOW
    
    # Set environment variables
    export COMPOSE_PROJECT_NAME=$PROJECT_NAME
    export NODE_ENV=$ENVIRONMENT
    
    # Pull latest changes if in git repo
    if [ -d ".git" ]; then
        print "📥 Pulling latest changes..." $BLUE
        git pull origin main || git pull origin master || true
    fi
    
    # Build and start services
    if [ "$ENVIRONMENT" = "production" ]; then
        print "🐳 Building and starting production containers..." $BLUE
        docker-compose -f docker-compose.yml --profile production down
        docker-compose -f docker-compose.yml --profile production build --no-cache
        docker-compose -f docker-compose.yml --profile production up -d
    else
        print "🐳 Building and starting development containers..." $BLUE
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
    fi
    
    # Wait for services to be healthy
    print "⏳ Waiting for services to be healthy..." $YELLOW
    sleep 30
    
    # Check health status
    check_health
}

# Function to check health of all services
check_health() {
    print_header
    print "🏥 Checking service health..." $YELLOW
    
    services=($([ "$ENVIRONMENT" = "production" ] && echo "django-api angular-shell react-analytics nginx" || echo "django-api angular-shell react-analytics"))
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            print "✅ $service: Running" $GREEN
        else
            print "❌ $service: Failed" $RED
            print "🔍 Checking logs for $service..." $BLUE
            docker-compose logs --tail=20 $service
        fi
    done
}

# Function to show status
show_status() {
    print_header
    print "📊 Deployment Status:" $YELLOW
    
    docker-compose ps
    
    print "\n🌐 Access URLs:" $BLUE
    print "   • Angular Shell: http://localhost:4200" $CYAN
    print "   • React Analytics: http://localhost:4201" $CYAN
    print "   • Django API: http://localhost:8000" $CYAN
    print "   • Django Admin: http://localhost:8000/admin/" $CYAN
    
    if [ "$ENVIRONMENT" = "production" ]; then
        print "   • Main Application: http://localhost" $CYAN
        print "   • HTTPS: https://localhost" $CYAN
    fi
    
    print "\n🔑 Default Credentials:" $YELLOW
    print "   Email: admin@enterprise.com" $CYAN
    print "   Password: Enterprise123!" $CYAN
}

# Function to rollback
rollback() {
    if [ -z "$2" ]; then
        print "❌ Please specify backup file to rollback to" $RED
        print "Usage: ./deploy.sh rollback backup-file.tar.gz" $YELLOW
        exit 1
    fi
    
    BACKUP_FILE=$2
    if [ ! -f "$BACKUP_FILE" ]; then
        print "❌ Backup file not found: $BACKUP_FILE" $RED
        exit 1
    fi
    
    print_header
    print "🔄 Rolling back to $BACKUP_FILE..." $YELLOW
    
    # Stop services
    docker-compose down
    
    # Restore backup
    print "📥 Restoring backup..." $BLUE
    tar xzf "$BACKUP_FILE" -C ./django-api/
    
    # Restart services
    docker-compose up -d
    
    print "✅ Rollback completed" $GREEN
}

# Function to clean up
cleanup() {
    print_header
    print "🧹 Cleaning up Docker resources..." $YELLOW
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful in production)
    if [ "$ENVIRONMENT" != "production" ]; then
        docker volume prune -f
    fi
    
    print "✅ Cleanup completed" $GREEN
}

# Function to show logs
show_logs() {
    local service=${2:-}
    if [ -n "$service" ]; then
        docker-compose logs -f $service
    else
        docker-compose logs -f
    fi
}

# Main execution
case "${1:-deploy}" in
    "dev"|"development")
        ENVIRONMENT="development"
        check_prerequisites
        deploy
        show_status
        ;;
        
    "prod"|"production")
        ENVIRONMENT="production"
        check_prerequisites
        backup_data
        deploy
        show_status
        ;;
        
    "deploy")
        check_prerequisites
        if [ "$ENVIRONMENT" = "production" ]; then
            backup_data
        fi
        deploy
        show_status
        ;;
        
    "status")
        show_status
        ;;
        
    "health")
        check_health
        ;;
        
    "logs")
        show_logs "$@"
        ;;
        
    "rollback")
        rollback "$@"
        ;;
        
    "cleanup"|"clean")
        cleanup
        ;;
        
    "stop")
        print_header
        print "🛑 Stopping all services..." $YELLOW
        docker-compose down
        print "✅ All services stopped" $GREEN
        ;;
        
    "restart")
        print_header
        print "🔄 Restarting all services..." $YELLOW
        docker-compose restart
        sleep 10
        check_health
        ;;
        
    "help"|"-h"|"--help")
        print_header
        print "📖 Usage:" $BOLD
        print "  ./deploy.sh [command] [options]" $CYAN
        echo
        print "🚀 Commands:" $BOLD
        print "  deploy, (no command)  Deploy to specified environment" $GREEN
        print "  dev, development     Deploy to development environment" $GREEN
        print "  prod, production     Deploy to production environment (with backup)" $GREEN
        print "  status               Show deployment status" $BLUE
        print "  health               Check health of all services" $BLUE
        print "  logs [service]       Show logs for all or specific service" $BLUE
        print "  rollback <backup>    Rollback to specific backup" $YELLOW
        print "  restart              Restart all services" $YELLOW
        print "  stop                 Stop all services" $RED
        print "  cleanup, clean       Clean up Docker resources" $RED
        print "  help, -h, --help     Show this help message" $CYAN
        echo
        print "🌍 Environment Variables:" $BOLD
        print "  DOCKER_REGISTRY      Docker registry URL (default: localhost:5000)" $CYAN
        print "  COMPOSE_PROJECT_NAME Project name for Docker Compose" $CYAN
        echo
        print "💡 Examples:" $YELLOW
        print "  ./deploy.sh prod                    # Deploy to production" $CYAN
        print "  ./deploy.sh dev                     # Deploy to development" $CYAN
        print "  ./deploy.sh logs django-api          # Show API logs" $CYAN
        print "  ./deploy.sh rollback backup-xxx.tar.gz # Rollback" $CYAN
        ;;
        
    *)
        print "❌ Unknown command: $1" $RED
        print "Use './deploy.sh help' for usage information" $YELLOW
        exit 1
        ;;
esac

print "\n🎉 Deployment operations completed!" $GREEN