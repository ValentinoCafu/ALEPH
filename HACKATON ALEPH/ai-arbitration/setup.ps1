# AI Arbitration - Windows Setup Script (PowerShell)
# Compatible con Windows 10/11
# Requiere: PowerShell 5.1+

param(
    [switch]$SkipPython,
    [switch]$SkipNode
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

function Write-Step {
    param([string]$Message)
    Write-Host "  $($Message)" -ForegroundColor Gray
}

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
Write-Host "  AI Arbitration - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# Verificar Python
# ============================================
if (-not $SkipPython) {
    Write-Host "Verificando Python..." -ForegroundColor Yellow
    try {
        $PythonVersion = python --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Python encontrado: $PythonVersion"
            
            # Verificar version minima
            $Version = $PythonVersion -replace "Python ", ""
            $Major = [int]($Version.Split(".")[0])
            $Minor = [int]($Version.Split(".")[1])
            
            if ($Major -lt 3 -or ($Major -eq 3 -and $Minor -lt 11)) {
                Write-Warning "Se recomienda Python 3.11+ para mejor compatibilidad"
            }
        } else {
            throw "Python no encontrado"
        }
    } catch {
        Write-Error "Python no esta instalado o no esta en PATH"
        Write-Host ""
        Write-Host "Por favor instala Python 3.11+ desde:" -ForegroundColor White
        Write-Host "  https://www.python.org/downloads/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Durante la instalacion, marca 'Add Python to PATH'" -ForegroundColor Yellow
        Write-Host ""
        $response = Read-Host "Quieres continuar de todas formas? (s/N)"
        if ($response -ne "s" -and $response -ne "S") {
            exit 1
        }
    }
}

# ============================================
# Verificar Node.js
# ============================================
if (-not $SkipNode) {
    Write-Host ""
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
        Write-Host ""
        Write-Host "Por favor instala Node.js 18+ desde:" -ForegroundColor White
        Write-Host "  https://nodejs.org/" -ForegroundColor Cyan
        Write-Host ""
        $response = Read-Host "Quieres continuar de todas formas? (s/N)"
        if ($response -ne "s" -and $response -ne "S") {
            exit 1
        }
    }
}

# ============================================
# Setup Backend
# ============================================
Write-Host ""
Write-Host "Configurando Backend..." -ForegroundColor Yellow
Write-Step "Navegando a backend..."
Set-Location "$ProjectRoot\backend"

Write-Step "Verificando .env..."
if (Test-Path ".env") {
    Write-Warning ".env ya existe. Omitiendo creacion."
} else {
    Write-Step "Creando .env desde plantilla..."
    Copy-Item ".env.example" ".env" -Force
    Write-Success ".env creado desde plantilla"
}

Write-Step "Verificando pip..."
try {
    $pip_check = python -m pip --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "pip no disponible"
    }
    Write-Success "pip disponible"
} catch {
    Write-Warning "pip no disponible. Intentando instalar setuptools..."
    python -m ensurepip --default-pip 2>&1 | Out-Null
}

Write-Step "Instalando dependencias de Python..."
python -m pip install -r requirements.txt --quiet 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencias de Python instaladas"
} else {
    Write-Error "Error instalando dependencias de Python"
}

Set-Location $ProjectRoot

# ============================================
# Setup Frontend
# ============================================
Write-Host ""
Write-Host "Configurando Frontend..." -ForegroundColor Yellow
Write-Step "Navegando a frontend..."
Set-Location "$ProjectRoot\frontend"

Write-Step "Verificando node_modules..."
if (Test-Path "node_modules") {
    Write-Warning "node_modules ya existe. Omitiendo instalacion."
} else {
    Write-Step "Instalando dependencias de Node.js..."
    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencias de Node.js instaladas"
    } else {
        Write-Error "Error instalando dependencias de Node.js"
    }
}

Set-Location $ProjectRoot

# ============================================
# Habilitar ejecucion de scripts (si es necesario)
# ============================================
Write-Host ""
Write-Host "Verificando permisos de ejecucion..." -ForegroundColor Yellow
$CurrentPolicy = Get-ExecutionPolicy -Scope CurrentUser
if ($CurrentPolicy -eq "Restricted" -or $CurrentPolicy -eq "AllSigned") {
    Write-Warning "La politica de ejecucion actual es: $CurrentPolicy"
    Write-Host "Para ejecutar los scripts de inicio, puedes cambiar la politica con:" -ForegroundColor White
    Write-Host "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O ejecutar los scripts directamente con:" -ForegroundColor White
    Write-Host "  powershell -ExecutionPolicy Bypass -File start.ps1" -ForegroundColor Cyan
}

# ============================================
# Completado
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Completo!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar la aplicacion:" -ForegroundColor White
Write-Host ""
Write-Host "  Opcion 1 - PowerShell:" -ForegroundColor Yellow
Write-Host "    .\start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "  Opcion 2 - Directo (si hay problemas de permisos):" -ForegroundColor Yellow
Write-Host "    powershell -ExecutionPolicy Bypass -File start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
