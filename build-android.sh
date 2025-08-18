#!/bin/bash

echo "Building Ovall Android APK..."
echo

# Check if Cordova is installed
if ! command -v cordova &> /dev/null; then
    echo "ERROR: Cordova is not installed or not in PATH"
    echo "Please install Cordova globally: npm install -g cordova"
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "WARNING: ANDROID_HOME environment variable not set"
    echo "Please install Android Studio and set ANDROID_HOME"
fi

echo "Step 1: Adding Android platform..."
cordova platform add android

echo
echo "Step 2: Preparing the project..."
cordova prepare android

echo
echo "Step 3: Building the APK..."
cordova build android

echo
echo "Build completed!"
echo
echo "APK location: platforms/android/app/build/outputs/apk/debug/app-debug.apk"
echo
echo "To install on device: cordova run android"
echo
