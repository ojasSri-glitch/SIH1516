@echo off
title JanSamvaad AI (SIH1516) - National Grievance Platform
color 0A
cls

echo ===================================================================
echo     INDIAN CITIZEN GRIEVANCE REDRESSAL PLATFORM (SIH1516)
echo                  JanSamvaad AI (??????? AI)
echo ===================================================================
echo.

:: 1. Navigate to Project Directory
set "PROJECT_DIR=%USERPROFILE%\Desktop\New folder\SIH1516-main"
if not exist "%PROJECT_DIR%\run_server.py" set "PROJECT_DIR=%USERPROFILE%\Desktop\jansamvaad-ai"
if not exist "%PROJECT_DIR%\run_server.py" set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo [1/3] Locating Python environment...
set "PYTHON_EXE="
if exist "%USERPROFILE%\AppData\Local\Python\pythoncore-3.14-64\python.exe" set "PYTHON_EXE=%USERPROFILE%\AppData\Local\Python\pythoncore-3.14-64\python.exe"
if not defined PYTHON_EXE if exist "%USERPROFILE%\AppData\Local\Python\bin\python.exe" set "PYTHON_EXE=%USERPROFILE%\AppData\Local\Python\bin\python.exe"
if not defined PYTHON_EXE (
    for /d %%i in ("%LOCALAPPDATA%\Programs\Python\Python3*") do (
        if exist "%%i\python.exe" set "PYTHON_EXE=%%i\python.exe"
    )
)
if not defined PYTHON_EXE (
    where py.exe >nul 2>&1 && set "PYTHON_EXE=py.exe"
)
if not defined PYTHON_EXE (
    where python.exe >nul 2>&1 && set "PYTHON_EXE=python.exe"
)

if not defined PYTHON_EXE (
    echo [ERROR] Could not find Python installation.
    echo Please ensure Python is installed.
    pause
    exit /b 1
)

echo Python Found: %PYTHON_EXE%
echo Project Dir:  %PROJECT_DIR%
echo.

echo [2/3] Freeing port 8000 if occupied...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo [3/3] Opening browser and starting server...
echo.
echo ===================================================================
echo    Server URL: http://localhost:8000
echo    Officer Portal Login:  mukund  /  1234
echo ===================================================================
echo.

:: Open browser
start http://localhost:8000

:: Run server
"%PYTHON_EXE%" run_server.py

pause
