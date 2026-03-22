# Guia de Instalacion - Windows

Este documento describe como ejecutar AI Arbitration en Windows usando PowerShell.

---

## Requisitos Previos

### Python 3.11+

1. Ve a https://www.python.org/downloads/
2. Descarga la version mas reciente de Python 3.11+
3. **IMPORTANTE**: Durante la instalacion, marca la opcion **"Add Python to PATH"**
4. Verifica la instalacion ejecutando en PowerShell:
   ```powershell
   python --version
   ```

### Node.js 18+

1. Ve a https://nodejs.org/
2. Descarga la version LTS (Recommended for most users)
3. Verifica la instalacion ejecutando en PowerShell:
   ```powershell
   node --version
   npm --version
   ```

---

## Instalacion Rapida (PowerShell)

### Paso 1: Abrir PowerShell

1. Presiona `Win + X` y selecciona **"Windows PowerShell (Admin)"**
2. O busca "PowerShell" en el menu Inicio y ejecutalo como Administrador

### Paso 2: Navegar al Proyecto

```powershell
cd ruta\al\ai-arbitration
```

### Paso 3: Ejecutar Setup

```powershell
.\setup.ps1
```

Esto automaticamente:
- Verificara que Python y Node.js estan instalados
- Creara el archivo `.env` con la configuracion
- Instalara las dependencias de Python
- Instalara las dependencias de Node.js

### Paso 4: Iniciar la Aplicacion

```powershell
.\start.ps1
```

Se abrira **2 terminales nuevas**:
- Terminal 1: Backend (Python/FastAPI)
- Terminal 2: Frontend (React/Vite)

---

## Comandos Alternativos

### Si hay problemas con permisos de ejecucion

PowerShell por defecto no permite ejecutar scripts. Si ves errores como:

```
No se puede cargar porque la ejecucion de scripts esta deshabilitada
```

Ejecuta esto **una vez**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego intenta ejecutar los scripts nuevamente.

### Ejecutar scripts directamente (sin cambiar politica)

Si no quieres cambiar la politica de ejecucion:

```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Iniciar solo el Backend

```powershell
cd backend
.\start.ps1
```

### Iniciar solo el Frontend

```powershell
cd frontend
.\start.ps1
```

---

## URLs de la Aplicacion

Una vez iniciada la aplicacion:

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Documentacion API | http://localhost:8000/docs |

---

## Solucion de Problemas

### Error: "No se puede cargar porque la ejecucion de scripts esta deshabilitada"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "No se encontro python"

1. Verifica que Python este instalado:
   ```powershell
   python --version
   ```
2. Si no esta, reinstallalo desde https://www.python.org/downloads/
3. Asegurate de marcar "Add Python to PATH" durante la instalacion
4. Reinicia PowerShell despues de instalar

### Error: "No se encontro node"

1. Verifica que Node.js este instalado:
   ```powershell
   node --version
   ```
2. Si no esta, reinstallalo desde https://nodejs.org/
3. Reinicia PowerShell despues de instalar

### Error: "El modulo 'pip' no se reconoce"

```powershell
python -m ensurepip --default-pip
python -m pip install --upgrade pip
```

### Problemas con el backend (GenLayer)

El backend requiere conexion a Internet para comunicarse con GenLayer Studio Online. Si el backend no inicia:

1. Verifica tu conexion a Internet
2. Verifica que el archivo `.env` existe en la carpeta `backend`

### Problemas con el frontend

1. Limpia la cache del navegador (Ctrl + Shift + R)
2. Verifica que el backend esta corriendo (http://localhost:8000/health)

---

## Estructura de Archivos Windows

```
ai-arbitration/
|
|-- setup.ps1          <- Script principal de setup
|-- start.ps1          <- Script principal de inicio
|
|-- backend/
|   |-- setup.ps1      <- Setup del backend
|   |-- start.ps1      <- Inicio del backend
|   |-- main.py        <- Servidor FastAPI
|   |-- .env           <- Configuracion (se crea automaticamente)
|   |-- venv/          <- Entorno virtual Python (se crea automaticamente)
|   |-- requirements.txt
|
|-- frontend/
|   |-- setup.ps1      <- Setup del frontend
|   |-- start.ps1      <- Inicio del frontend
|   |-- src/           <- Codigo fuente React
|   |-- node_modules/  <- Dependencias Node.js (se crean automaticamente)
|   |-- package.json
```

---

## Actualizar el Proyecto

Para obtener las ultimas actualizaciones:

```powershell
git pull origin main
.\setup.ps1
```

---

## Mas Informacion

Para informacion general sobre el proyecto, consulta el archivo [README.md](./README.md).
