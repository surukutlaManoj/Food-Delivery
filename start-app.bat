@echo off
echo Starting Food Delivery Application...
echo.
echo Starting Backend Server on port 5000...
start "Food-Delivery-Server" cmd /k "cd /d %~dp0server && npm start"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Client on port 3000...
start "Food-Delivery-Client" cmd /k "cd /d %~dp0client && npm start"
echo.
echo Both services are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
