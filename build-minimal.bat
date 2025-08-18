@echo off
echo ==========================================
echo Ovall Android APK Builder (Minimal Setup)
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "config.xml" (
    echo ERROR: config.xml not found. Please run this script from the Ovall project directory.
    pause
    exit /b 1
)

echo Step 1: Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ Node.js found
)

echo.
echo Step 2: Installing/Checking Cordova...
where cordova >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Cordova globally...
    npm install -g cordova
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Cordova
        echo Try running as administrator or check your internet connection
        pause
        exit /b 1
    )
) else (
    echo ✓ Cordova found
)

echo.
echo Step 3: Checking Android SDK...
if not defined ANDROID_HOME (
    echo.
    echo ⚠️  ANDROID_HOME not set. Attempting to use minimal setup...
    echo.
    
    REM Try to find Android SDK in common locations
    set ANDROID_SDK_FOUND=0
    
    if exist "%USERPROFILE%\AppData\Local\Android\Sdk" (
        set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
        set ANDROID_SDK_FOUND=1
        echo ✓ Found Android SDK at: %ANDROID_HOME%
    )
    
    if exist "C:\Android\Sdk" (
        set ANDROID_HOME=C:\Android\Sdk
        set ANDROID_SDK_FOUND=1
        echo ✓ Found Android SDK at: %ANDROID_HOME%
    )
    
    if %ANDROID_SDK_FOUND%==0 (
        echo.
        echo ❌ Android SDK not found in common locations.
        echo.
        echo SOLUTION OPTIONS:
        echo 1. Download Android Command Line Tools from:
        echo    https://developer.android.com/studio#command-tools
        echo 2. Extract to C:\Android\Sdk
        echo 3. Or use online build service (see build-alternatives.md)
        echo.
        pause
        exit /b 1
    )
)

REM Set PATH for Android tools
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\build-tools\30.0.3

echo ✓ Android SDK configured: %ANDROID_HOME%

echo.
echo Step 4: Adding Android platform...
cordova platform add android 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Platform already added or error occurred, continuing...
)

echo.
echo Step 5: Building APK...
echo This may take a few minutes...
cordova build android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo APK Location: platforms\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo To install on device:
    echo 1. Enable Developer Options and USB Debugging on your Android device
    echo 2. Connect device via USB
    echo 3. Run: adb install platforms\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Or copy the APK file to your device and install manually.
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo.
    echo Common solutions:
    echo 1. Check that Java JDK is installed
    echo 2. Verify Android SDK is properly installed
    echo 3. Try running: cordova clean android
    echo 4. Consider using online build service (see build-alternatives.md)
)

echo.
pause
