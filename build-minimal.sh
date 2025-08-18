#!/bin/bash

echo "=========================================="
echo "Ovall Android APK Builder (Minimal Setup)"
echo "=========================================="
echo

# Check if we're in the right directory
if [ ! -f "config.xml" ]; then
    echo "ERROR: config.xml not found. Please run this script from the Ovall project directory."
    exit 1
fi

echo "Step 1: Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please download and install Node.js from: https://nodejs.org/"
    exit 1
else
    echo "✓ Node.js found"
fi

echo
echo "Step 2: Installing/Checking Cordova..."
if ! command -v cordova &> /dev/null; then
    echo "Installing Cordova globally..."
    npm install -g cordova
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install Cordova"
        echo "Try running with sudo or check your internet connection"
        exit 1
    fi
else
    echo "✓ Cordova found"
fi

echo
echo "Step 3: Checking Android SDK..."
if [ -z "$ANDROID_HOME" ]; then
    echo
    echo "⚠️  ANDROID_HOME not set. Attempting to use minimal setup..."
    echo
    
    # Try to find Android SDK in common locations
    ANDROID_SDK_FOUND=0
    
    # macOS locations
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        ANDROID_SDK_FOUND=1
        echo "✓ Found Android SDK at: $ANDROID_HOME"
    fi
    
    # Linux locations
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        ANDROID_SDK_FOUND=1
        echo "✓ Found Android SDK at: $ANDROID_HOME"
    fi
    
    if [ -d "/opt/android-sdk" ]; then
        export ANDROID_HOME="/opt/android-sdk"
        ANDROID_SDK_FOUND=1
        echo "✓ Found Android SDK at: $ANDROID_HOME"
    fi
    
    if [ $ANDROID_SDK_FOUND -eq 0 ]; then
        echo
        echo "❌ Android SDK not found in common locations."
        echo
        echo "SOLUTION OPTIONS:"
        echo "1. Download Android Command Line Tools from:"
        echo "   https://developer.android.com/studio#command-tools"
        echo "2. Extract to ~/Android/Sdk (Linux) or ~/Library/Android/sdk (macOS)"
        echo "3. Or use online build service (see build-alternatives.md)"
        echo
        exit 1
    fi
fi

# Set PATH for Android tools
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/build-tools/30.0.3

echo "✓ Android SDK configured: $ANDROID_HOME"

echo
echo "Step 4: Adding Android platform..."
cordova platform add android 2>/dev/null || echo "Platform already added or error occurred, continuing..."

echo
echo "Step 5: Building APK..."
echo "This may take a few minutes..."
cordova build android

if [ $? -eq 0 ]; then
    echo
    echo "✅ BUILD SUCCESSFUL!"
    echo
    echo "APK Location: platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    echo
    echo "To install on device:"
    echo "1. Enable Developer Options and USB Debugging on your Android device"
    echo "2. Connect device via USB"
    echo "3. Run: adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    echo
    echo "Or copy the APK file to your device and install manually."
else
    echo
    echo "❌ BUILD FAILED!"
    echo
    echo "Common solutions:"
    echo "1. Check that Java JDK is installed"
    echo "2. Verify Android SDK is properly installed"
    echo "3. Try running: cordova clean android"
    echo "4. Consider using online build service (see build-alternatives.md)"
fi

echo
