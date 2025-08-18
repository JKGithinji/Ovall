#!/bin/bash

echo "===================================="
echo "Ovall Android APK Builder - Docker"
echo "===================================="
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please download and install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "Step 1: Building Docker image..."
echo "This may take 10-15 minutes on first run (downloads Android SDK)"
docker build -t ovall-android-builder .

if [ $? -ne 0 ]; then
    echo "ERROR: Docker build failed"
    exit 1
fi

echo
echo "Step 2: Extracting APK from Docker container..."
docker create --name temp-ovall ovall-android-builder
docker cp temp-ovall:/app/platforms/android/app/build/outputs/apk/debug/app-debug.apk ./ovall-android.apk
docker rm temp-ovall

if [ -f "ovall-android.apk" ]; then
    echo
    echo "✅ BUILD SUCCESSFUL!"
    echo
    echo "APK Location: ovall-android.apk"
    echo "File size: $(ls -lh ovall-android.apk | awk '{print $5}')"
    echo
    echo "To install on device:"
    echo "1. Copy ovall-android.apk to your Android device"
    echo "2. Enable 'Install from unknown sources' in device settings"
    echo "3. Tap the APK file to install"
else
    echo "ERROR: APK extraction failed"
fi

echo
