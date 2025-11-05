@echo off
echo Starting Food Delivery Client (JavaScript)...
echo.
cd /d "%~dp0"

echo Installing dependencies...
call npm install
echo.

echo Starting development server on http://localhost:3000
echo Backend should be running on http://localhost:5000
echo.
echo Press Ctrl+C to stop
echo.

call npm start
