# 🚀 Ovall Android APK Deployment Guide

## Quick Start (5 Minutes)

If you have all prerequisites installed, you can build the APK in just a few steps:

```bash
# 1. Install dependencies (if not already done)
npm install -g cordova

# 2. Run the build script
# Windows:
.\build-android.bat

# macOS/Linux:
chmod +x build-android.sh && ./build-android.sh

# 3. Find your APK at:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 📋 Prerequisites Checklist

- [ ] **Node.js** installed (v14+ recommended)
- [ ] **Cordova** installed globally (`npm install -g cordova`)
- [ ] **Android Studio** installed with SDK
- [ ] **Environment variables** set (ANDROID_HOME, PATH)
- [ ] **Java JDK** 8+ installed

## 🔧 Detailed Setup

### 1. Install Node.js and Cordova

```bash
# Check if Node.js is installed
node --version
npm --version

# Install Cordova globally
npm install -g cordova

# Verify installation
cordova --version
```

### 2. Android Studio Setup

1. **Download Android Studio**: https://developer.android.com/studio
2. **Install Android Studio** with default settings
3. **Open Android Studio** and complete the setup wizard
4. **Install Android SDK**:
   - Go to SDK Manager (Tools → SDK Manager)
   - Install Android API Level 30+ (recommended)
   - Install Android SDK Build-Tools
   - Install Android SDK Platform-Tools

### 3. Environment Variables

**Windows (Command Prompt):**
```cmd
# Replace USERNAME with your actual username
set ANDROID_HOME=C:\Users\USERNAME\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

# Make permanent via System Properties → Environment Variables
```

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

**macOS/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk        # Linux
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

## 🏗️ Building the APK

### Option 1: Automated Build (Recommended)

**Windows:**
```bash
.\build-android.bat
```

**macOS/Linux:**
```bash
chmod +x build-android.sh
./build-android.sh
```

### Option 2: Manual Build

```bash
# Step 1: Add Android platform
cordova platform add android

# Step 2: Prepare project
cordova prepare android

# Step 3: Build APK
cordova build android

# Optional: Build release APK
cordova build android --release
```

## 📱 Installing the APK

### Method 1: Direct Device Installation

1. **Enable Developer Options**:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect Device and Install**:
   ```bash
   # Install directly to connected device
   cordova run android
   
   # Or install APK manually
   adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Method 2: Manual APK Installation

1. **Copy APK to device** (via USB, email, cloud storage)
2. **Enable "Unknown Sources"** in device settings
3. **Tap APK file** to install

### Method 3: Android Emulator

1. **Start Android Emulator** from Android Studio
2. **Install to emulator**:
   ```bash
   cordova run android
   ```

## 🎨 Customizing Icons and Splash Screens

The project includes SVG templates that need to be converted to PNG:

### Quick Icon Generation

1. **Use the provided SVG templates**:
   - `res/icon.svg` - App icon
   - `res/splash.svg` - Splash screen

2. **Convert to PNG** using online tools:
   - [Convertio](https://convertio.co/svg-png/)
   - [CloudConvert](https://cloudconvert.com/svg-to-png)

3. **Generate all sizes**:
   ```bash
   # Run the icon generation helper
   node generate-icons.js
   
   # Follow the instructions to create PNG files
   ```

### Manual Icon Creation

If you have ImageMagick or Inkscape installed:

```bash
# Using ImageMagick
magick convert -background none -size 192x192 res/icon.svg res/android/icon-xxxhdpi.png
magick convert -background none -size 144x144 res/icon.svg res/android/icon-xxhdpi.png
# ... repeat for other sizes

# Using Inkscape
inkscape -w 192 -h 192 res/icon.svg -o res/android/icon-xxxhdpi.png
inkscape -w 144 -h 144 res/icon.svg -o res/android/icon-xxhdpi.png
# ... repeat for other sizes
```

## 🐛 Troubleshooting

### Common Build Errors

**"cordova: command not found"**
```bash
# Solution: Install Cordova globally
npm install -g cordova
# Restart terminal
```

**"ANDROID_HOME is not set"**
```bash
# Solution: Set environment variable
# Windows
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# macOS/Linux
export ANDROID_HOME=$HOME/Library/Android/sdk
```

**"No target specified"**
```bash
# Solution: Install Android SDK platforms
# Open Android Studio → SDK Manager → Install API Level 30+
```

**"Gradle build failed"**
```bash
# Solution: Clean and rebuild
cordova clean android
cordova build android
```

### Debugging

**View app logs:**
```bash
# Connect device and view logs
adb logcat | findstr "chromium"  # Windows
adb logcat | grep "chromium"    # macOS/Linux
```

**Test in browser first:**
```bash
# Serve locally for testing
cordova serve
# Open http://localhost:8000 in browser
```

## 📦 Release Build

For production release (Google Play Store):

```bash
# Build release APK
cordova build android --release

# Sign the APK (requires keystore)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name

# Align the APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## 📊 Performance Tips

1. **Test on multiple devices** and Android versions
2. **Monitor memory usage** during gameplay
3. **Test offline functionality** (airplane mode)
4. **Verify touch gestures** work smoothly
5. **Check battery usage** during extended play

## 🎯 Next Steps

1. **Test the APK** on real devices
2. **Gather user feedback** and iterate
3. **Consider publishing** to Google Play Store
4. **Add analytics** to track usage
5. **Implement push notifications** for engagement

## 📞 Support

- **Check logs** with `adb logcat`
- **Test in browser** first with `cordova serve`
- **Verify all prerequisites** are installed
- **Try on different devices** and Android versions

---

**Happy Building! 🎮📱**
