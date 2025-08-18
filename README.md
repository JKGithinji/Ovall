# Ovall - Wikipedia Swiping Game (Android APK)

A mobile-optimized Wikipedia swiping game where you predict whether pages are liked or disliked by the community. Built with Apache Cordova for Android deployment.

## 🎮 Game Features

- **Swipe Interface**: Intuitive swipe gestures (left for dislike, right for like)
- **Difficulty Levels**: Easy, Medium, and Hard modes
- **Real Wikipedia Content**: Dynamic content from Wikipedia API
- **Scoring System**: Points based on prediction accuracy
- **Streak Tracking**: Build streaks for bonus points
- **Comment System**: Leave feedback on Wikipedia pages
- **Mobile Optimized**: Touch-friendly interface designed for mobile devices

## 📱 Building the Android APK

### Prerequisites

1. **Node.js and npm**: Download from [nodejs.org](https://nodejs.org/)
2. **Apache Cordova**: Install globally
   ```bash
   npm install -g cordova
   ```
3. **Android Studio**: Download from [developer.android.com](https://developer.android.com/studio)
4. **Java Development Kit (JDK)**: Version 8 or higher

### Environment Setup

1. Install Android Studio and open it
2. Install Android SDK (API level 30 or higher recommended)
3. Set environment variables:
   ```bash
   # Windows
   set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
   set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

   # macOS/Linux
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

### Build Instructions

#### Method 1: Using Build Scripts

**Windows:**
```bash
# Run the batch file
.\build-android.bat
```

**macOS/Linux:**
```bash
# Make script executable and run
chmod +x build-android.sh
./build-android.sh
```

#### Method 2: Manual Commands

```bash
# Add Android platform
cordova platform add android

# Prepare the project
cordova prepare android

# Build the APK
cordova build android

# Optional: Run on connected device
cordova run android
```

### Output Location

The built APK will be located at:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🚀 Installation

### Install on Device

1. **Via USB (Developer Mode)**:
   - Enable Developer Options and USB Debugging on your Android device
   - Connect device to computer
   - Run: `cordova run android`

2. **Manual Installation**:
   - Transfer the APK file to your device
   - Enable "Install from Unknown Sources" in device settings
   - Open the APK file to install

### Install on Emulator

1. Open Android Studio
2. Start an Android Virtual Device (AVD)
3. Run: `cordova run android`

## 🛠 Development

### Project Structure

```
Ovall/
├── index.html          # Main app file (web app)
├── config.xml          # Cordova configuration
├── package.json        # Node.js dependencies
├── res/                # App resources
│   ├── icon.svg        # App icon (SVG)
│   ├── splash.svg      # Splash screen (SVG)
│   └── android/        # Android-specific resources
├── platforms/          # Generated platform code
└── plugins/            # Cordova plugins
```

### Key Features

- **Responsive Design**: Adapts to different screen sizes
- **Touch Gestures**: Native swipe support
- **Offline Capability**: Local storage for game data
- **Network Detection**: Handles online/offline states
- **Status Bar Integration**: Matches app theme

### Plugins Used

- `cordova-plugin-whitelist`: Security policy
- `cordova-plugin-splashscreen`: Splash screen management
- `cordova-plugin-statusbar`: Status bar styling
- `cordova-plugin-device`: Device information
- `cordova-plugin-network-information`: Network status

## 🎨 Customization

### App Icon and Splash Screen

The project includes SVG templates for icons and splash screens:
- `res/icon.svg` - App icon template
- `res/splash.svg` - Splash screen template

To generate PNG assets from SVG:
1. Use online converters or tools like Inkscape
2. Generate multiple densities (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
3. Place in `res/android/` directory

### App Configuration

Edit `config.xml` to modify:
- App name and description
- Package ID (com.ovall.app)
- Version number
- Permissions
- Preferences

## 🐛 Troubleshooting

### Common Issues

1. **"cordova: command not found"**
   - Install Cordova globally: `npm install -g cordova`
   - Restart terminal/command prompt

2. **Android SDK not found**
   - Install Android Studio
   - Set ANDROID_HOME environment variable
   - Add SDK tools to PATH

3. **Build fails with Gradle error**
   - Update Android SDK and build tools
   - Check Java version (JDK 8+ required)
   - Clean and rebuild: `cordova clean android`

4. **App crashes on startup**
   - Check device logs: `adb logcat`
   - Ensure all required permissions are granted
   - Test on different Android versions

### Debug Mode

To enable debug mode and view console logs:
1. Connect device via USB
2. Enable USB Debugging
3. Run: `adb logcat | grep -i chromium`

## 📄 License

MIT License - Feel free to modify and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Cordova documentation
- Test on multiple devices and Android versions

---

**Happy Swiping! 🎮**
