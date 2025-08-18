FROM node:18-bullseye

# Install Java JDK
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools/30.0.3

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    cd ${ANDROID_HOME}/cmdline-tools && \
    curl -o sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip sdk-tools.zip && \
    mv cmdline-tools latest && \
    rm sdk-tools.zip

# Accept Android SDK licenses and install required packages
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Install Cordova globally
RUN npm install -g cordova

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install npm dependencies (if any)
RUN npm install 2>/dev/null || true

# Add Android platform and build
RUN cordova platform add android && \
    cordova build android

# The APK will be available at /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk
