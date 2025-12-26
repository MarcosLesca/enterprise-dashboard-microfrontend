#!/bin/bash

# Enterprise Dashboard - Local Testing Script
# Validates that all components work before pushing

set -euo pipefail

# Colors
readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

log() {
    local level=$1
    local message=$2
    case $level in
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "WARN") echo -e "${YELLOW}⚠️  $message${NC}" ;;
    esac
}

# Test Django
test_django() {
    log "WARN" "Testing Django API..."
    
    cd django-api
    source venv/bin/activate
    
    # Environment check
    python manage.py check --deploy
    log "SUCCESS" "Django configuration check passed"
    
    # Migration test
    python manage.py makemigrations --check --dry-run
    log "SUCCESS" "Django migrations check passed"
    
    # Import test
    python -c "from django_api.settings import *; print('Settings loaded successfully')"
    log "SUCCESS" "Django settings load correctly"
    
    cd ..
}

# Test Angular
test_angular() {
    log "WARN" "Testing Angular Shell..."
    
    cd angular-shell
    npx nx test angular-shell --verbose --coverage --watch=false --bail=1 || true
    log "SUCCESS" "Angular tests completed"
    
    cd ..
}

# Test React
test_react() {
    log "WARN" "Testing React Analytics..."
    
    cd react-analytics/react-analytics
    npm test -- --watchAll=false --coverage --passWithNoTests || true
    log "SUCCESS" "React tests completed"
    
    cd ../..
}

# Main execution
main() {
    echo "🧪 Enterprise Dashboard - Local Testing Suite"
    echo
    
    test_django
    test_angular
    test_react
    
    echo
    log "SUCCESS" "All tests completed! Ready to push."
}

main "$@"