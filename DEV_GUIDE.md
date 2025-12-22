# 🎯 Enterprise Dashboard - Guía de Desarrollo

## 📋 Resumen

Enterprise Dashboard es una arquitectura de **micro-frontends** con:

- **Django API** (port 8000) - Backend REST con JWT
- **Angular Shell** (port 4200) - Host application con Module Federation
- **React Analytics** (port 4201) - Remote micro-frontend
- **Nx Workspace** - Monorepo con tooling moderno

---

## 🚀 Inicio Rápido

### Opción 1: El Script Moderno (Recomendado)

```bash
# Iniciar TODOS los servicios
./dev.sh start

# Detener TODOS los servicios
./dev.sh stop

# Ver estado de los servicios
./dev.sh status

# Ver logs en tiempo real
./dev.sh logs
```

### Opción 2: Manual (si sos bravucone)

```bash
# Terminal 1: Django API
cd django-api
python manage.py runserver 8000

# Terminal 2: Angular Shell
npx nx serve angular-shell --port 4200

# Terminal 3: React Analytics
npx nx serve react-analytics-react-analytics --port 4201
```

---

## 🔧 Comandos del Script

| Comando            | Descripción                          | Ejemplo            |
| ------------------ | ------------------------------------ | ------------------ |
| `./dev.sh start`   | Inicia todos los servicios           | `./dev.sh start`   |
| `./dev.sh stop`    | Detiene todos los servicios          | `./dev.sh stop`    |
| `./dev.sh restart` | Reinicia todos los servicios         | `./dev.sh restart` |
| `./dev.sh status`  | Muestra estado de los puertos        | `./dev.sh status`  |
| `./dev.sh logs`    | Muestra logs de todos los servicios  | `./dev.sh logs`    |
| `./dev.sh clean`   | Limpia puertos y archivos temporales | `./dev.sh clean`   |
| `./dev.sh help`    | Muestra ayuda                        | `./dev.sh help`    |

---

## 🌐 URLs de Acceso

### Aplicaciones

- **Angular Shell**: http://localhost:4200
- **React Analytics**: http://localhost:4201
- **Django API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin/

### Credenciales por Defecto

```
Email:    admin@enterprise.com
Password: Enterprise123!
```

---

## 📂 Estructura del Proyecto

```
enterprise-dashboard-microfrontend/
├── angular-shell/           # Angular host application
├── react-analytics/         # React micro-frontend
│   └── react-analytics/     # Subdirectorio del proyecto
├── django-api/              # Django REST API
├── shared/                  # Shared design system
├── dev.sh                   # 🎯 Nuestro script moderno
└── package.json             # Nx workspace configuration
```

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. "Port already in use"

```bash
./dev.sh clean  # Limpia puertos bloqueados
./dev.sh start  # Vuelve a iniciar
```

#### 2. "Permission denied"

```bash
chmod +x dev.sh  # Dá permisos de ejecución
```

#### 3. Node.js version warnings

El script funciona con Node.js v25+ aunque Angular CLI tire warnings. Es un tema de compatibilidad temporal.

#### 4. React Analytics 403 Restricted

¡Ya está arreglado! El script configura automáticamente Vite para permitir acceso al sistema de archivos.

---

## 🔍 Logs y Debugging

### Ver Logs Individuales

```bash
# Django API logs
tail -f .django.log

# Angular logs
tail -f .angular.log

# React Analytics logs
tail -f .react.log
```

### Ver Todos los Logs

```bash
# Multitail para ver todos juntos
./dev.sh logs
```

---

## 🏗️ Arquitectura Técnica

### Module Federation

- **Angular Shell** es el host que carga remotos
- **React Analytics** es un remote expuesto como micro-frontend
- **Comunicación** vía Web Components/Module Federation

### Stack Tecnológico

- **Frontend**: Angular 17 + React 18 + TypeScript
- **Backend**: Django 4.x + Django REST Framework
- **Build Tools**: Nx + Vite + Webpack
- **Styling**: Tailwind CSS + Design System compartido

---

## 💡 Tips Pro

### 1. Desarrollo Eficiente

```bash
# Levantá todo con el script
./dev.sh start

# En otra terminal, watched files
npm run watch  # Si existe el comando
```

### 2. Limpieza Profunda

```bash
# Limpiar todo (node_modules, logs, puertos)
./dev.sh clean
rm -rf node_modules
npm install
./dev.sh start
```

### 3. Testing

```bash
# Test de integración
curl http://localhost:8000/api/
curl http://localhost:4200
curl http://localhost:4201
```

---

## 📝 Notas Importantes

1. **El script maneja todo** dependencias, puertos, logs automáticamente
2. **Node.js v25+ funciona** pero tira warnings de compatibilidad
3. **Los puertos son fijos**: 8000 (Django), 4200 (Angular), 4201 (React)
4. **Los logs se guardan** en archivos `.django.log`, `.angular.log`, `.react.log`
5. **Siempre usá `./dev.sh stop`** antes de cerrar para terminar procesos

---

## 🚨 Emergencias

### Si todo se rompió:

```bash
# 1. Detener todo
./dev.sh stop

# 2. Limpiar profundo
./dev.sh clean

# 3. Verificar dependencias
./dev.sh status

# 4. Reiniciar desde cero
./dev.sh start
```

### Si un servicio no inicia:

```bash
# Revisar logs específicos
tail -f .django.log    # para Django
tail -f .angular.log   # para Angular
tail -f .react.log     # para React
```

---

🎯 **LISTO!** Con este script y esta guía, tenés un entorno de desarrollo enterprise-ready en segundos. Dejá de perder tiempo con configuraciones y ponete a codear!
