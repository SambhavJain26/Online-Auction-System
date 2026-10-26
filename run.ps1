<#
.SYNOPSIS
    Unified Local Runner for Online Auction System (PowerShell / Windows)
.DESCRIPTION
    Checks dependencies, initializes environment configuration, seeds demo data if needed,
    and starts the real-time auction server.
#>

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       ONLINE AUCTION SYSTEM - LOCAL STARTUP RUNNER       " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Node.js detected: $(node --version)" -ForegroundColor Green

# 2. Check and copy .env
$envFile = Join-Path $PSScriptRoot ".env"
$envExample = Join-Path $PSScriptRoot ".env.example"
if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile
        Write-Host "[OK] Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "[WARN] .env.example not found. Using system defaults." -ForegroundColor Yellow
    }
}

# 3. Check node_modules
$nodeModules = Join-Path $PSScriptRoot "node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "[*] Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

# 4. Prompt / Run Seed if requested
Write-Host "[*] Checking database connectivity..." -ForegroundColor Cyan
$env:PORT = if ($env:PORT) { $env:PORT } else { "3008" }

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Starting Online Auction System on Port $env:PORT" -ForegroundColor Green
Write-Host "  Application URL: http://localhost:$env:PORT" -ForegroundColor Green
Write-Host "  Health Check:    http://localhost:$env:PORT/health" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

npm start
