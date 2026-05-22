@echo off
setlocal
cd /d %~dp0

echo Starting Postgres (Docker)...
docker compose up -d

echo Starting backend (FastAPI)...
start "backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload"

echo Starting frontend (Vite)...
start "frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo All services started.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
endlocal
