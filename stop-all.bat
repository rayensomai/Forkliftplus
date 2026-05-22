@echo off
setlocal
cd /d %~dp0

echo Stopping backend (FastAPI)...
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq python.exe" /v ^| findstr /i "ForklfiftPLUS\\backend"') do taskkill /PID %%a /F

echo Stopping frontend (Vite)...
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /v ^| findstr /i "ForklfiftPLUS\\frontend"') do taskkill /PID %%a /F

echo Stopping Postgres (Docker)...
docker compose down

echo All services stopped.
endlocal
