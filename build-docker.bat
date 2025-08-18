@echo off
echo ====================================
echo Ovall Android APK Builder - Docker
echo ====================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please download and install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Step 1: Building Docker image...
echo This may take 10-15 minutes on first run (downloads Android SDK)
docker build -t ovall-android-builder .

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker build failed
    pause
    exit /b 1
)

echo.
echo Step 2: Extracting APK from Docker container...
docker create --name temp-ovall ovall-android-builder
docker cp temp-ovall:/app/platforms/android/app/build/outputs/apk/debug/app-debug.apk ./ovall-android.apk
docker rm temp-ovall

if exist "ovall-android.apk" (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo APK Location: ovall-android.apk
    echo File size: 
    for %%A in ("ovall-android.apk") do echo %%~zA bytes
    echo.
    echo To install on device:
    echo 1. Copy ovall-android.apk to your Android device
    echo 2. Enable "Install from unknown sources" in device settings
    echo 3. Tap the APK file to install
) else (
    echo ERROR: APK extraction failed
)

echo.
pause
