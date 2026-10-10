@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo Car Rental System - Development Setup
echo ========================================

if not exist "env\Scripts\python.exe" (
    echo Creating Python virtual environment...
    python -m venv env
    if errorlevel 1 (
        echo ERROR: Could not create virtual environment.
        pause
        exit /b 1
    )
)

echo Installing backend dependencies...
"env\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
    echo ERROR: Backend dependency installation failed.
    pause
    exit /b 1
)

echo Running database migrations...
pushd backend
"..\env\Scripts\python.exe" -m alembic upgrade head
popd
if errorlevel 1 (
    echo ERROR: Database migration failed.
    pause
    exit /b 1
)

echo Installing frontend dependencies...

if not exist "frontend\package.json" (
    echo ERROR: frontend\package.json not found.
    pause
    exit /b 1
)

call npm --prefix "frontend" install
if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
pause
endlocal
