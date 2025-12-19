# 🎉 Enterprise Dashboard - Windows-Ready!
> Complete micro-frontend system ready for Windows cloning and deployment

## 🏗️ Project Overview

A comprehensive enterprise dashboard demonstrating micro-frontend architecture using Angular shell, React analytics module, and Django backend with JWT authentication.

## 🚀 Architecture

### Frontend Applications
- **Angular Shell** (Port 4200): Host application managing routing and layout
- **React Analytics** (Port 4201): Remote micro-frontend with dashboard widgets

### Backend Services  
- **Django REST API** (Port 8000): Authentication and data management

### Key Technologies
- **Module Federation**: Cross-framework micro-frontend communication
- **JWT Authentication**: Secure token-based auth across services
- **Nx Monorepo**: Unified development and build system

## 📁 Project Structure

```
enterprise-dashboard-microfrontend/
├── apps/
│   ├── angular-shell/          # Angular host application
│   ├── react-analytics/        # React remote application  
│   └── django-api/            # Django REST API
├── tools/
└── shared/                    # Shared utilities and types
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+
- Python 3.8+
- Git

### Quick Start

1. **Start All Services:**
   ```bash
   ./start_all_services.sh
   ```

2. **Access Applications:**
   - Angular Shell: http://localhost:4200
   - React Analytics: http://localhost:4201  
   - Django Admin: http://localhost:8000/admin/

3. **Stop All Services:**
   ```bash
   ./stop_services.sh
   ```

### Manual Setup

#### Backend Setup
```bash
cd apps/django-api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
./venv/bin/python manage.py migrate
./venv/bin/python manage.py runserver 0.0.0.0:8000
```

#### Frontend Setup
```bash
# Angular Shell
cd apps/angular-shell
npm install
npm start

# React Analytics  
cd apps/react-analytics
npm install
npm start
```

## 🔌 API Endpoints

### Authentication
- `POST /api/token/` - Get JWT tokens
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/auth/register/` - User registration
- `GET/PUT /api/auth/profile/` - User profile

### Data Management
- `GET/POST /api/dashboards/` - Dashboard CRUD
- `GET/POST /api/widgets/` - Widget CRUD
- `GET /api/dashboards/{id}/widgets/` - Dashboard widgets

## 🎯 Features Implemented

### ✅ Core Features
- [x] Micro-frontend architecture with Module Federation
- [x] JWT authentication across all services
- [x] CORS configuration for cross-origin requests
- [x] Django REST API with ViewSets
- [x] Angular standalone components (v17+)
- [x] React 18 with TypeScript
- [x] Responsive dashboard layouts
- [x] Interactive charts and widgets

### ✅ Authentication System
- [x] User registration and login
- [x] Token-based authentication
- [x] Protected routes and API endpoints
- [x] Admin user management

### ✅ Data Models
- [x] Custom User model
- [x] Dashboard management
- [x] Widget system with JSON configuration
- [x] Owner-based permissions

## 🔑 Default Credentials

**Admin User:**
- Email: `admin@enterprise.com`
- Username: `admin`
- Password: `Enterprise123!`

## 🧪 Testing

### API Testing
```bash
# Get JWT token
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@enterprise.com", "password": "Enterprise123!"}'

# Access protected endpoint
curl -X GET http://localhost:8000/api/dashboards/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Integration Testing
1. Navigate to Angular Shell
2. Use credentials to login
3. Access embedded React Analytics module
4. Verify cross-framework communication

## 🚀 Deployment Guide

### Quick Deployment Options

#### 1. Docker Production (Recommended)
```bash
# Clone and build
git clone <repository>
cd enterprise-dashboard-microfrontend
docker-compose up -d

# Access services
# Frontend: http://localhost
# API: http://localhost/api
# Admin: http://localhost/admin
```

#### 2. Manual Production Deployment
```bash
# Backend Deployment
cd apps/django-api
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=django_api.production
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn django_api.wsgi:application --bind 0.0.0.0:8000

# Frontend Deployment
cd apps/angular-shell
npm install --production
npm run build
# Serve dist/ folder with nginx or CDN

cd apps/react-analytics  
npm install --production
npm run build
# Serve dist/ folder with nginx or CDN
```

### Production Configuration

#### Environment Variables
Create `.env` file in each app directory:

**Backend (.env):**
```bash
# Security
SECRET_KEY=your-very-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/enterprise_dashboard

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Frontend (.env):**
```bash
# API URLs
API_BASE_URL=https://api.yourdomain.com/api
REACT_APP_API_URL=https://api.yourdomain.com/api

# Module Federation URLs
ANGULAR_REMOTE_URL=https://yourdomain.com
REACT_REMOTE_URL=https://analytics.yourdomain.com
```

#### Database Setup (PostgreSQL)
```sql
-- Create database and user
CREATE DATABASE enterprise_dashboard;
CREATE USER enterprise_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE enterprise_dashboard TO enterprise_user;
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend (Angular)
    location / {
        root /path/to/angular-shell/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # React Analytics
    location /analytics/ {
        alias /path/to/react-analytics/dist/;
        try_files $uri $uri/ /index.html;
    }
    
    # Django API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Django Admin
    location /admin/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# HTTPS with SSL
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Same location blocks as above
}
```

### Docker Production Setup

#### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: enterprise_dashboard
      POSTGRES_USER: enterprise_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./apps/django-api
    environment:
      - DATABASE_URL=postgresql://enterprise_user:${DB_PASSWORD}@db:5432/enterprise_dashboard
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
      - redis
    ports:
      - "8000:8000"

  angular:
    build: ./apps/angular-shell
    environment:
      - API_BASE_URL=http://backend:8000/api
    ports:
      - "80:80"
    depends_on:
      - backend

  react:
    build: ./apps/react-analytics
    environment:
      - REACT_APP_API_URL=http://backend:8000/api
    ports:
      - "4201:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "django_api.wsgi:application"]
```

#### Frontend Dockerfiles
```dockerfile
# Angular Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# React Dockerfile  
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Cloud Deployment

#### Heroku Deployment
```bash
# Backend
cd apps/django-api
heroku create enterprise-api
heroku buildpacks:add heroku/python
git subtree push --prefix apps/django-api heroku main

# Frontend (Angular)
cd apps/angular-shell  
heroku create enterprise-dashboard
heroku buildpacks:add heroku/nodejs
echo '{"name": "enterprise-dashboard", "scripts": {"postinstall": "npm run build", "start": "http-server dist"}}' > package.json
git subtree push --prefix apps/angular-shell heroku main
```

#### Railway Deployment
```bash
# Backend
railway login
railway init
railway add --service django-api
railway up

# Frontend
railway add --service angular-shell
railway up
```

#### Vercel (Frontend)
```bash
# Angular
cd apps/angular-shell
vercel --prod

# React
cd apps/react-analytics  
vercel --prod
```

#### DigitalOcean App Platform
```yaml
# .do/app.yaml
name: enterprise-dashboard
services:
- name: api
  source_dir: apps/django-api
  github:
    repo: your-username/enterprise-dashboard
    branch: main
  run_command: "gunicorn django_api.wsgi:application"
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  
- name: angular
  source_dir: apps/angular-shell
  github:
    repo: your-username/enterprise-dashboard
    branch: main
  build_command: "npm run build"
  run_command: "http-server dist -p $PORT"
  environment_slug: node
  instance_count: 1
  instance_size_slug: basic-xxs
```

## 🤝 Development Workflow

### Adding New Features
1. **Backend**: Create Django models and API endpoints
2. **Frontend**: Add components in appropriate micro-frontend
3. **Integration**: Update Module Federation configs
4. **Testing**: Verify cross-framework communication

### Code Organization
- Shared types in `shared/` directory
- Reusable components in respective app `components/` folders
- API calls organized by domain (auth, dashboards, widgets)

## 🔧 Troubleshooting & Monitoring

### Production Issues

**Port Conflicts:**
```bash
# Check ports
ss -tlnp | grep :8000
ss -tlnp | grep :80
ss -tlnp | grep :443

# Kill processes
sudo fuser -k 8000/tcp
sudo fuser -k 80/tcp
```

**Django Production Issues:**
```bash
# Check logs
docker-compose logs backend
tail -f /var/log/nginx/error.log

# Database issues
python manage.py check --deploy
python manage.py collectstatic --noinput
```

**Frontend Build Issues:**
```bash
# Module Federation errors
curl -H "Accept: application/json" http://localhost:8000/api/
npx nx serve --verbose

# Clear build cache
rm -rf node_modules/.cache
npm run build -- --reset-cache
```

### Performance Monitoring

#### Health Checks
```bash
# Backend health
curl -f http://api.yourdomain.com/api/health || echo "Backend down"

# Frontend health
curl -f http://yourdomain.com || echo "Frontend down"

# Database connectivity
python manage.py dbshell --command "SELECT 1;"
```

#### Log Aggregation (ELK Stack)
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: logstash:8.8.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"

  kibana:
    image: kibana:8.8.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

#### Application Performance Monitoring (APM)
```javascript
// Frontend Error Tracking
window.addEventListener('error', (event) => {
  fetch('/api/errors/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })
  });
});
```

### Security Checklist

#### Django Security
```bash
# Security check
python manage.py check --deploy

# Required settings
DEBUG=False
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_CONTENT_TYPE_NOSNIFF=True
SECURE_BROWSER_XSS_FILTER=True
X_FRAME_OPTIONS=DENY
```

#### Frontend Security
```javascript
// CSP Headers in nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.yourdomain.com";

# CORS Backend
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
CORS_ALLOW_CREDENTIALS = True
```

### Backup & Recovery

#### Database Backups
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="enterprise_dashboard"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress old backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -exec gzip {} \;

# Upload to cloud (optional)
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://your-backup-bucket/
```

#### Application Backups
```bash
# Frontend assets backup
tar -czf frontend_backup_$(date +%Y%m%d).tar.gz apps/angular-shell/dist apps/react-analytics/dist

# Django media backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz apps/django-api/media/
```

**Django Migrations:**
```bash
# Reset migrations
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
```

**Module Federation Issues:**
- Check `webpack.config.js` remote URLs
- Verify CORS configuration
- Check network tab for 404 errors

## 📈 Performance Optimizations

### Implemented
- Lazy loading of micro-frontends
- Code splitting with Module Federation
- JWT token refresh management
- Database query optimization

### Future Enhancements
- Caching strategies (Redis)
- CDN integration
- Bundle size optimization
- Service workers for offline support

## 📚 Documentation

- [Module Federation Documentation](https://module-federation.io/)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [JWT Authentication](https://github.com/jazzband/djangorestframework-simplejwt)

## 🎉 Next Steps

1. **Advanced Analytics**: Add more chart types and data visualization
2. **Real-time Updates**: WebSocket integration for live dashboard updates
3. **Testing Suite**: Comprehensive unit and integration tests
4. **CI/CD Pipeline**: GitHub Actions for automated deployment
5. **Monitoring**: Application performance monitoring
6. **Security**: Additional security layers and audit logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ using modern web technologies**