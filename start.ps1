# Capacity Connect - PowerShell Starter
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "               CAPACITY CONNECT - DEVELOPMENT STARTER                 " -ForegroundColor Cyan
Write-Host "      Digital Capacity Building & Learning Management Portal          " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$RootPath = $PSScriptRoot
Set-Location $RootPath

# 1. Check Python
try {
    $pythonVer = python --version 2>&1
    Write-Host "[OK] Python: $pythonVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python is not installed or not in PATH." -ForegroundColor Red
    pause
    exit 1
}

# 2. Check Node
try {
    $nodeVer = node --version 2>&1
    Write-Host "[OK] Node.js: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    pause
    exit 1
}

# 3. Setup Backend Environment
Write-Host "`n[1/3] Checking Backend Environment..." -ForegroundColor Yellow
if (-not (Test-Path "$RootPath\backend\.venv\Scripts\python.exe")) {
    Write-Host "[*] Creating Python virtual environment..."
    python -m venv "$RootPath\backend\.venv"
    Write-Host "[*] Installing backend dependencies..."
    & "$RootPath\backend\.venv\Scripts\python.exe" -m pip install --upgrade pip
    & "$RootPath\backend\.venv\Scripts\pip.exe" install -r "$RootPath\backend\requirements.txt" -r "$RootPath\backend\requirements-dev.txt"
}

if (-not (Test-Path "$RootPath\backend\.env")) {
    Write-Host "[*] Generating backend\.env from template..."
    Copy-Item "$RootPath\backend\.env.example" "$RootPath\backend\.env"
}

# 4. Setup Frontend Environment
Write-Host "`n[2/3] Checking Frontend Environment..." -ForegroundColor Yellow
if (-not (Test-Path "$RootPath\frontend\node_modules")) {
    Write-Host "[*] Installing frontend npm dependencies..."
    Push-Location "$RootPath\frontend"
    cmd.exe /c "npm.cmd install"
    Pop-Location
}

if (-not (Test-Path "$RootPath\frontend\.env.local")) {
    Write-Host "[*] Generating frontend\.env.local from template..."
    Copy-Item "$RootPath\frontend\.env.example" "$RootPath\frontend\.env.local"
}

# 5. Launch Servers in Separate Windows
Write-Host "`n[3/3] Launching Servers..." -ForegroundColor Yellow
Write-Host "[*] Starting Backend (FastAPI on http://127.0.0.1:8000)..."
Start-Process cmd.exe -ArgumentList "/k", "call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000" -WorkingDirectory "$RootPath\backend"

Write-Host "[*] Starting Frontend (Next.js on http://localhost:3000)..."
Start-Process cmd.exe -ArgumentList "/k", "npm.cmd run dev" -WorkingDirectory "$RootPath\frontend"

# 6. Open Browser
Write-Host "`n[*] Waiting 3 seconds for development servers to spin up..."
Start-Sleep -Seconds 3
Write-Host "[*] Opening browser to http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "                CAPACITY CONNECT IS RUNNING!                          " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  - Frontend Portal:    http://localhost:3000"
Write-Host "  - Backend Health:     http://localhost:3000/api/health (via proxy)"
Write-Host "  - FastAPI Direct:     http://127.0.0.1:8000"
Write-Host "  - API Swagger Docs:   http://127.0.0.1:8000/api/docs"
Write-Host "======================================================================"
Write-Host "To stop servers, close the individual Backend and Frontend windows."
Write-Host ""
pause
