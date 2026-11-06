@echo off
echo ========================================================
echo   Starting Smart Campus Complaint Portal (MERN Stack)
echo ========================================================
echo.
echo 1. Launching Backend Server on http://localhost:5000 ...
start "SmartCampus Backend" cmd /k "cd backend && npm start"

echo.
echo 2. Launching Frontend Client on http://localhost:5173 ...
start "SmartCampus Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started!
echo Open your browser at: http://localhost:5173
echo.
