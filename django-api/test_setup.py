#!/usr/bin/env python

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and return success status."""
    print(f"\n🔄 {description}")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True,
            cwd='/home/lescanomarcos/projects/enterprise-dashboard-microfrontend/apps/django-api'
        )
        
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            if result.stdout.strip():
                print(f"Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} - FAILED")
            print(f"Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ {description} - EXCEPTION: {str(e)}")
        return False

def main():
    """Test Django API setup."""
    print("🚀 Testing Django API Setup")
    print("=" * 50)
    
    # Test 1: Check virtual environment exists
    if not os.path.exists('/home/lescanomarcos/projects/enterprise-dashboard-microfrontend/apps/django-api/venv'):
        print("❌ Virtual environment not found")
        return False
    print("✅ Virtual environment exists")
    
    # Test 2: Install dependencies
    if not run_command(
        "source venv/bin/activate && pip install -r requirements.txt",
        "Installing Python dependencies"
    ):
        return False
    
    # Test 3: Check Django project structure
    required_files = [
        'manage.py',
        'django_api/__init__.py',
        'django_api/settings.py',
        'django_api/urls.py',
        'django_api/wsgi.py',
        'django_api/asgi.py',
        'core/__init__.py',
        'core/models.py',
        'core/views.py',
        'core/serializers.py',
        'core/urls.py',
        'core/admin.py',
        'core/apps.py'
    ]
    
    print("\n🔍 Checking Django project structure...")
    for file_path in required_files:
        full_path = f'/home/lescanomarcos/projects/enterprise-dashboard-microfrontend/apps/django-api/{file_path}'
        if os.path.exists(full_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            return False
    
    # Test 4: Django migrations
    if not run_command(
        "source venv/bin/activate && python manage.py makemigrations",
        "Creating migrations"
    ):
        return False
    
    if not run_command(
        "source venv/bin/activate && python manage.py migrate",
        "Running migrations"
    ):
        return False
    
    # Test 5: Create superuser (non-interactive)
    if not run_command(
        'source venv/bin/activate && python manage.py shell -c "from core.models import User; User.objects.create_superuser(\'admin@example.com\', \'admin\', \'admin123\') if not User.objects.filter(email=\'admin@example.com\').exists() else print(\'Admin user already exists\')"',
        "Creating admin user"
    ):
        return False
    
    # Test 6: Django check
    if not run_command(
        "source venv/bin/activate && python manage.py check",
        "Django system check"
    ):
        return False
    
    print("\n🎉 Django API setup completed successfully!")
    print("\n📋 Summary:")
    print("✅ Virtual environment created")
    print("✅ Dependencies installed")
    print("✅ Project structure valid")
    print("✅ Database migrated")
    print("✅ Admin user created")
    print("✅ System checks passed")
    
    print("\n🚀 Next steps:")
    print("1. Start server: source venv/bin/activate && python manage.py runserver 0.0.0.0:8000")
    print("2. Admin panel: http://localhost:8000/admin/")
    print("3. API docs: http://localhost:8000/api/")
    print("4. Auth endpoints: http://localhost:8000/api/auth/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)