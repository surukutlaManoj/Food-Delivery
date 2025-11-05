@echo off
echo Starting Food-Delivery Node.js Server...
echo.
cd /d "%~dp0"
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
echo Installing dependencies...
call npm install
echo.
echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop
echo.
call npm start
