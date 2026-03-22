# AI Arbitration - Windows Start Script (PowerShell)
# Inicia ambos servicios (Backend y Frontend) en terminales separadas

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $($Message)" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARN] $($Message)" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $($Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Arbitration - Iniciando" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# Verificar que existe .env
# ============================================
Write-Host "Verificando configuracion..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Write-Error "backend\.env no encontrado"
    Write-Host ""
    Write-Host "Ejecuta '.\setup.ps1' primero para configurar el proyecto." -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}
Write-Success "Archivo .env encontrado"

# ============================================
# Verificar que existe node_modules
# ============================================
if (-not (Test-Path "frontend\node_modules")) {
    Write-Warning "node_modules no encontrado. Instalando dependencias..."
    Set-Location "$ProjectRoot\frontend"
    npm install
    Set-Location $ProjectRoot
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencias de Node.js instaladas"
    } else {
        Write-Error "Error instalando dependencias de Node.js"
        pause
        exit 1
    }
}

# ============================================
# Detener servicios anteriores (si existen)
# ============================================
Write-Host ""
Write-Host "Deteniendo servicios anteriores..." -ForegroundColor Yellow
$BackendJobs = Get-Job -Name "AI-Arbitration-Backend" -ErrorAction SilentlyContinue
if ($BackendJobs) {
    Stop-Job -Name "AI-Arbitration-Backend" -ErrorAction SilentlyContinue
    Remove-Job -Name "AI-Arbitration-Backend" -Force -ErrorAction SilentlyContinue
}

# ============================================
# Iniciar Backend en nueva terminal
# ============================================
Write-Host ""
Write-Host "Iniciando Backend (Python/FastAPI)..." -ForegroundColor Yellow

$BackendScript = @"
cd /d `"$ProjectRoot\backend`"
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
"@

# Crear archivo temporal para el script del backend
$BackendScriptPath = "$env:TEMP\ai_arbitration_backend.ps1"
$BackendScript | Out-File -FilePath $BackendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Write-Host ''; Write-Host '========================================' -ForegroundColor Cyan; Write-Host '  AI Arbitration - Backend' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; Write-Host ''; cd '$ProjectRoot\backend'; python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt 2>&1 | Out-Null; Write-Host ''; Write-Host 'Iniciando servidor...' -ForegroundColor Green; Write-Host ''; uvicorn main:app --reload --host 0.0.0.0 --port 8000 }" -WindowStyle Normal

Write-Success "Backend iniciado en nueva terminal"

# ============================================
# Esperar un momento
# ============================================
Write-Host "Esperando que el backend inicie..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# ============================================
# Iniciar Frontend en nueva terminal
# ============================================
Write-Host ""
Write-Host "Iniciando Frontend (React/Vite)..." -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Write-Host ''; Write-Host '========================================' -ForegroundColor Cyan; Write-Host '  AI Arbitration - Frontend' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; Write-Host ''; cd '$ProjectRoot\frontend'; npm run dev }" -WindowStyle Normal

Write-Success "Frontend iniciado en nueva terminal"

# ============================================
# Esperar y verificar
# ============================================
Write-Host ""
Write-Host "Verificando servicios..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $BackendHealth = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($BackendHealth.StatusCode -eq 200) {
        Write-Success "Backend responding en http://localhost:8000"
    }
} catch {
    Write-Warning "Backend aun no responde (puede tardar unos segundos)"
}

# ============================================
# Completado
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servicios Iniciados!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Accede a la aplicacion:" -ForegroundColor White
Write-Host ""
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se abrieron 2 terminales nuevas con los servicios." -ForegroundColor Yellow
Write-Host "Cierra las terminales para detener los servicios." -ForegroundColor Yellow
Write-Host ""

# Limpiar archivo temporal
Remove-Item $BackendScriptPath -ErrorAction SilentlyContinue
