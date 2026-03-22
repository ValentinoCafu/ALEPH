# AI Arbitration - Frontend Setup Script (PowerShell)
# Configura el frontend en Windows

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
Write-Host "  AI Arbitration - Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar a directorio del frontend
Set-Location $ProjectRoot

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $NodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Node.js encontrado: $NodeVersion"
        
        # Verificar version minima
        $Version = $NodeVersion -replace "v", ""
        $Major = [int]($Version.Split(".")[0])
        
        if ($Major -lt 18) {
            Write-Warning "Se recomienda Node.js 18+ para mejor compatibilidad"
        }
    } else {
        throw "Node.js no encontrado"
    }
} catch {
    Write-Error "Node.js no esta instalado o no esta en PATH"
    Write-Host "Descarga Node.js desde: https://nodejs.org/" -ForegroundColor White
    exit 1
}

# Verificar o crear node_modules
Write-Host ""
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Warning "node_modules ya existe. Omitiendo instalacion."
} else {
    Write-Host "Instalando dependencias de Node.js..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencias instaladas"
    } else {
        Write-Error "Error instalando dependencias"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Frontend Configurado!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el frontend:" -ForegroundColor White
Write-Host "  .\start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "O manualmente:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
