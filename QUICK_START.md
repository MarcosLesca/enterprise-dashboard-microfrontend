# 🚀 Quick Start Guide

## Start All Services

### Windows

```bash
# Option 1: Using npm (recommended)
npm run dev

# Option 2: Direct script
start-services.bat

# Option 3: PowerShell
.\start-services.ps1  # if you create it
```

### Linux/macOS

```bash
# Option 1: Using npm (recommended)
npm run dev

# Option 2: Direct script
./start-services.sh
```

### Cross-platform Node.js (works everywhere)

```bash
npm run start
# or
node start-services.js start
```

## Available Commands

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start all development services |
| `npm run start`  | Same as above                  |
| `npm run stop`   | Stop all running services      |
| `npm run build`  | Build all applications         |
| `npm run status` | Check service status           |
| `npm run clean`  | Clean caches and dependencies  |
| `npm run help`   | Show help message              |

## Access Points

Once running, access your applications at:

- **Angular Shell**: http://localhost:4200
- **React Analytics**: http://localhost:4201
- **Django API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin/

## Default Credentials

- **Email**: admin@enterprise.com
- **Password**: Enterprise123!

## Troubleshooting

### Port Conflicts

```bash
# Check what's using ports
netstat -ano | findstr :4200  # Windows
lsof -i :4200  # Linux/macOS

# Stop services
npm run stop
```

### Clean Reset

```bash
npm run clean
npm install
npm run dev
```

### Manual Start (if scripts fail)

**Django API:**

```bash
cd django-api
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

**Angular Shell:**

```bash
cd angular-shell
npm install
npx ng serve
```

**React Analytics:**

```bash
npx nx serve react-analytics-react-analytics
```
