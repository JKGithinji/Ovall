@echo off
echo Converting SVG icons to PNG...
echo.
echo This requires ImageMagick or similar tool to be installed
echo.
echo Example commands:
echo.

REM Icon conversions (replace 'magick' with your converter)
echo magick convert -background none -size 36x36 ..\icon.svg icon-ldpi.png
echo magick convert -background none -size 48x48 ..\icon.svg icon-mdpi.png
echo magick convert -background none -size 72x72 ..\icon.svg icon-hdpi.png
echo magick convert -background none -size 96x96 ..\icon.svg icon-xhdpi.png
echo magick convert -background none -size 144x144 ..\icon.svg icon-xxhdpi.png
echo magick convert -background none -size 192x192 ..\icon.svg icon-xxxhdpi.png
echo.

REM Splash screen conversions
echo magick convert -background none -size 200x320 ..\splash.svg splash-port-ldpi.png
echo magick convert -background none -size 320x480 ..\splash.svg splash-port-mdpi.png
echo magick convert -background none -size 480x800 ..\splash.svg splash-port-hdpi.png
echo magick convert -background none -size 720x1280 ..\splash.svg splash-port-xhdpi.png
echo magick convert -background none -size 960x1600 ..\splash.svg splash-port-xxhdpi.png
echo magick convert -background none -size 1280x1920 ..\splash.svg splash-port-xxxhdpi.png
echo.
echo Manual conversion completed!
pause