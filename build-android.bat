@echo off
echo Building Ovall Android APK...
echo.

REM Check if Cordova is installed
where cordova >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Cordova is not installed or not in PATH
    echo Please install Cordova globally: npm install -g cordova
    pause
    exit /b 1
)

REM Check if Android SDK is available
if not defined ANDROID_HOME (
    echo WARNING: ANDROID_HOME environment variable not set
    echo Please install Android Studio and set ANDROID_HOME
)

echo Step 1: Adding Android platform...
cordova platform add android

echo.
echo Step 2: Preparing the project...
cordova prepare android

echo.
echo Step 3: Building the APK...
cordova build android

echo.
echo Build completed!
echo.
echo APK location: platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo To install on device: cordova run android
echo.
pause
