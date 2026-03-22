# AI Arbitration - Backend Setup Script (PowerShell)
# Configura el backend en Windows

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
Write-Host "  AI Arbitration - Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar a directorio del backend
Set-Location $ProjectRoot

# Verificar Python
Write-Host "Verificando Python..." -ForegroundColor Yellow
try {
    $PythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Python encontrado: $PythonVersion"
    } else {
        throw "Python no encontrado"
    }
} catch {
    Write-Error "Python no esta instalado o no esta en PATH"
    Write-Host "Descarga Python desde: https://www.python.org/downloads/" -ForegroundColor White
    exit 1
}

# Verificar o crear .env
Write-Host ""
Write-Host "Verificando configuracion..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Warning ".env ya existe. Omitiendo creacion."
} else {
    if (Test-Path ".env.example") {
        Write-Host "Creando .env desde plantilla..."
        Copy-Item ".env.example" ".env"
        Write-Success ".env creado"
    } else {
        Write-Error ".env.example no encontrado"
        exit 1
    }
}

# Crear virtual environment
Write-Host ""
Write-Host "Configurando entorno virtual..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Warning "venv ya existe. Omitiendo creacion."
} else {
    Write-Host "Creando virtual environment..."
    python -m venv venv
    Write-Success "Virtual environment creado"
}

# Instalar dependencias
Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencias instaladas"
} else {
    Write-Error "Error instalando dependencias"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Backend Configurado!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el backend:" -ForegroundColor White
Write-Host "  .\start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "O manualmente:" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "  uvicorn main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Gray
Write-Host ""
