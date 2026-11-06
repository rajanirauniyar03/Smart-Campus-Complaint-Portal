Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Smart Campus Complaint Portal (MERN Stack)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Launching Backend Server on http://localhost:5000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

Write-Host "2. Launching Frontend Client on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "✅ Both servers launched in separate windows!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📡 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
