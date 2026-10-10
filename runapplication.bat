@echo off
setlocal
cd /d "%~dp0"

if not exist "env\Scripts\python.exe" (
    echo ERROR: Python environment not found.
    echo Run setupdev.bat first.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not found.
    echo Run setupdev.bat first.
    pause
    exit /b 1
)

echo Starting Car Rental System...

start "Car Rental Backend" powershell.exe -NoExit -Command "Set-Location '%~dp0backend'; & '%~dp0env\Scripts\python.exe' main.py"

timeout /t 3 /nobreak >nul

start "Car Rental Frontend" powershell.exe -NoExit -Command "Set-Location '%~dp0frontend'; npm start"


echo.
echo Startup commands sent.
echo Backend: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo Frontend: http://localhost:5173
echo.
endlocal
