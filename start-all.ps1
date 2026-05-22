$ErrorActionPreference = "Stop"

Set-Location "$PSScriptRoot"

Write-Host "Starting Postgres (Docker)..."
docker compose up -d

Write-Host "Starting backend (FastAPI)..."
Start-Process -WorkingDirectory "$PSScriptRoot\backend" -FilePath "python" -ArgumentList "-m", "uvicorn", "app.main:app", "--reload"

Write-Host "Starting frontend (Vite)..."
Start-Process -WorkingDirectory "$PSScriptRoot\frontend" -FilePath "npm" -ArgumentList "run", "dev"

Write-Host "All services started."
Write-Host "Backend: http://127.0.0.1:8000"
Write-Host "Frontend: http://localhost:5173"
