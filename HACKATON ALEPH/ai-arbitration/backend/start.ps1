# AI Arbitration - Backend Start Script (PowerShell)
# Inicia el servidor FastAPI en Windows

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $($Message)" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $($Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Arbitration - Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar a directorio del backend
Set-Location $ProjectRoot

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Error "Archivo .env no encontrado"
    Write-Host ""
    Write-Host "Ejecuta '.\setup.ps1' primero para configurar el backend." -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}
Write-Success "Archivo .env encontrado"

# Verificar virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creando virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host ""
Write-Host "Iniciando servidor..." -ForegroundColor Green
Write-Host ""

# Activar venv e iniciar uvicorn
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
