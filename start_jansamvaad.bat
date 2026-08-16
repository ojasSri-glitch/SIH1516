@echo off
title JanSamvaad AI - SIH1516 Server
cd /d "%~dp0"
echo =========================================================
echo    Starting JanSamvaad AI Platform (SIH1516)...
echo    URL: http://localhost:8000
echo =========================================================
start http://localhost:8000
python run_server.py
pause
