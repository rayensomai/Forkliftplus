$ErrorActionPreference = "Stop"

Set-Location "$PSScriptRoot"

Write-Host "Stopping backend (FastAPI)..."
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
  $_.Path -like "*\\ForklfiftPLUS\\backend*"
} | Stop-Process -Force

Write-Host "Stopping frontend (Vite)..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
  $_.Path -like "*\\ForklfiftPLUS\\frontend*"
} | Stop-Process -Force

Write-Host "Stopping Postgres (Docker)..."
docker compose down

Write-Host "All services stopped."
