@echo off
setlocal enabledelayedexpansion

title Capacity Connect - Starting Application

echo ======================================================================
echo                CAPACITY CONNECT - DEVELOPMENT STARTER
echo       Digital Capacity Building ^& Learning Management Portal
echo ======================================================================
echo.

cd /d "%~dp0"

:: 0. Check Prerequisites
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not found in your system PATH.
    echo Please install Python 3.11+ and ensure "Add python.exe to PATH" is checked.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js / npm is not found in your system PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 1. Check & Setup Backend Virtual Environment
echo [1/3] Checking Backend Environment...
if not exist "backend\.venv\Scripts\python.exe" (
    echo [*] Creating Python virtual environment in backend\.venv...
    python -m venv backend\.venv
    echo [*] Installing backend dependencies...
    call backend\.venv\Scripts\python.exe -m pip install --upgrade pip
    call backend\.venv\Scripts\pip.exe install -r backend\requirements.txt -r backend\requirements-dev.txt
)

if not exist "backend\.env" (
    echo [*] Generating backend\.env from template...
    copy "backend\.env.example" "backend\.env" >nul
)

:: 2. Check & Setup Frontend Node Modules
echo [2/3] Checking Frontend Environment...
if not exist "frontend\node_modules" (
    echo [*] Installing frontend npm dependencies...
    pushd "%~dp0frontend"
    call npm.cmd install
    popd
)

if not exist "frontend\.env.local" (
    echo [*] Generating frontend\.env.local from template...
    copy "frontend\.env.example" "frontend\.env.local" >nul
)

:: 3. Launch Servers in Separate Windows
echo [3/3] Launching Servers...
echo.
echo [*] Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "Capacity Connect - Backend (FastAPI)" /D "%~dp0backend" cmd /k "call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo [*] Starting Frontend (Next.js on http://localhost:3000)...
start "Capacity Connect - Frontend (Next.js)" /D "%~dp0frontend" cmd /k "npm.cmd run dev"

:: 4. Auto-Open Browser
echo.
echo [*] Waiting 3 seconds for servers to start...
timeout /t 3 /nobreak >nul
echo [*] Opening browser to http://localhost:3000...
start http://localhost:3000

echo.
echo ======================================================================
echo                 CAPACITY CONNECT IS RUNNING!
echo ======================================================================
echo   - Frontend Portal:    http://localhost:3000
echo   - Backend Health:     http://localhost:3000/api/health (via proxy)
echo   - FastAPI Direct:     http://127.0.0.1:8000
echo   - API Swagger Docs:   http://127.0.0.1:8000/api/docs
echo ======================================================================
echo To stop the servers, close the individual Backend and Frontend windows.
echo.
pause
