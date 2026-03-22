# AI Arbitration - Frontend Start Script (PowerShell)
# Inicia el servidor de desarrollo en Windows

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
Write-Host "  AI Arbitration - Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar a directorio del frontend
Set-Location $ProjectRoot

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Warning "node_modules no encontrado. Instalando dependencias..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencias instaladas"
    } else {
        Write-Error "Error instalando dependencias"
        exit 1
    }
}

Write-Host ""
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host ""
Write-Host "El frontend estara disponible en:" -ForegroundColor White
Write-Host "  http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor." -ForegroundColor Yellow
Write-Host ""

# Iniciar Vite
npm run dev
