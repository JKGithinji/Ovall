#!/usr/bin/env node

/**
 * Icon Generation Script for Ovall Android App
 * 
 * This script creates placeholder PNG files for Android icons and splash screens.
 * In a real environment, you would use proper image processing tools.
 */

const fs = require('fs');
const path = require('path');

// Android icon sizes
const iconSizes = {
    'icon-ldpi.png': 36,
    'icon-mdpi.png': 48,
    'icon-hdpi.png': 72,
    'icon-xhdpi.png': 96,
    'icon-xxhdpi.png': 144,
    'icon-xxxhdpi.png': 192
};

// Android splash screen sizes
const splashSizes = {
    'splash-port-ldpi.png': { width: 200, height: 320 },
    'splash-port-mdpi.png': { width: 320, height: 480 },
    'splash-port-hdpi.png': { width: 480, height: 800 },
    'splash-port-xhdpi.png': { width: 720, height: 1280 },
    'splash-port-xxhdpi.png': { width: 960, height: 1600 },
    'splash-port-xxxhdpi.png': { width: 1280, height: 1920 }
};

const androidDir = path.join(__dirname, 'res', 'android');

// Ensure directory exists
if (!fs.existsSync(androidDir)) {
    fs.mkdirSync(androidDir, { recursive: true });
}

console.log('🎨 Generating Android app icons and splash screens...');
console.log('📁 Output directory:', androidDir);
console.log();

// Create placeholder files (in a real environment, use proper image processing)
console.log('📋 Icon sizes needed:');
Object.entries(iconSizes).forEach(([filename, size]) => {
    const filePath = path.join(androidDir, filename);
    const placeholder = `<!-- Placeholder for ${filename} (${size}x${size}px) -->
<!-- Convert res/icon.svg to ${size}x${size} PNG and save as ${filename} -->
<!-- Use tools like Inkscape, GIMP, or online converters -->`;
    
    fs.writeFileSync(filePath + '.placeholder', placeholder);
    console.log(`  ✓ ${filename} - ${size}x${size}px`);
});

console.log();
console.log('📋 Splash screen sizes needed:');
Object.entries(splashSizes).forEach(([filename, dimensions]) => {
    const filePath = path.join(androidDir, filename);
    const placeholder = `<!-- Placeholder for ${filename} (${dimensions.width}x${dimensions.height}px) -->
<!-- Convert res/splash.svg to ${dimensions.width}x${dimensions.height} PNG and save as ${filename} -->
<!-- Use tools like Inkscape, GIMP, or online converters -->`;
    
    fs.writeFileSync(filePath + '.placeholder', placeholder);
    console.log(`  ✓ ${filename} - ${dimensions.width}x${dimensions.height}px`);
});

console.log();
console.log('🔧 To generate actual PNG files:');
console.log('1. Use the SVG templates in res/icon.svg and res/splash.svg');
console.log('2. Convert to PNG using:');
console.log('   - Inkscape (free): inkscape -w SIZE -h SIZE input.svg -o output.png');
console.log('   - GIMP (free): Open SVG, export as PNG');
console.log('   - Online tools: convertio.co, cloudconvert.com');
console.log('   - ImageMagick: convert -background none -size SIZExSIZE input.svg output.png');
console.log();
console.log('3. Replace the .placeholder files with actual PNG files');
console.log('4. Remove the .placeholder extension');
console.log();
console.log('✅ Placeholder files created successfully!');

// Create a simple batch file for Windows users
const batchContent = `@echo off
echo Converting SVG icons to PNG...
echo.
echo This requires ImageMagick or similar tool to be installed
echo.
echo Example commands:
echo.

REM Icon conversions (replace 'magick' with your converter)
echo magick convert -background none -size 36x36 ..\\icon.svg icon-ldpi.png
echo magick convert -background none -size 48x48 ..\\icon.svg icon-mdpi.png
echo magick convert -background none -size 72x72 ..\\icon.svg icon-hdpi.png
echo magick convert -background none -size 96x96 ..\\icon.svg icon-xhdpi.png
echo magick convert -background none -size 144x144 ..\\icon.svg icon-xxhdpi.png
echo magick convert -background none -size 192x192 ..\\icon.svg icon-xxxhdpi.png
echo.

REM Splash screen conversions
echo magick convert -background none -size 200x320 ..\\splash.svg splash-port-ldpi.png
echo magick convert -background none -size 320x480 ..\\splash.svg splash-port-mdpi.png
echo magick convert -background none -size 480x800 ..\\splash.svg splash-port-hdpi.png
echo magick convert -background none -size 720x1280 ..\\splash.svg splash-port-xhdpi.png
echo magick convert -background none -size 960x1600 ..\\splash.svg splash-port-xxhdpi.png
echo magick convert -background none -size 1280x1920 ..\\splash.svg splash-port-xxxhdpi.png
echo.
echo Manual conversion completed!
pause`;

fs.writeFileSync(path.join(androidDir, 'convert-icons.bat'), batchContent);
console.log('💾 Created convert-icons.bat for Windows users');
console.log('📍 Location: res/android/convert-icons.bat');
