# LocationBasedAssistance

A location-based assistance app built with Expo and React Native, providing features like nearby hospitals, toll plazas, and more.

## Demo

Check out this screen recording demonstrating the app's functionality: [App Demo Video](https://github.com/MeghaKh-07/LocationBasedAssistance/releases/download/v1.0-demo/1716897380936.mp4)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- Google Maps API key
- Firebase project setup

## Setup

1. **Clone the repository**:
   ```
   git clone https://github.com/MeghaKh-07/LocationBasedAssistance.git
   cd LocationBasedAssistance
   ```

2. **Install dependencies**:
   Navigate to the Expo app folder:
   ```
   cd location-based-assistance
   npm install
   ```
   Or with yarn:
   ```
   yarn install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```
     cp .env.example .env
     ```
   - Fill in your actual keys in `.env`:
     - `GOOGLE_API_KEY`: Your Google Maps API key (enable Places API, Distance Matrix API, Geocoding API)
     - Firebase config variables: Get from your Firebase project settings

3. **Set up Expo Application Services (EAS)** (optional, for builds):
   ```
   npm install -g @expo/eas-cli
   cd location-based-assistance
   eas init
   ```
   This will generate a unique project ID for your EAS builds.

## Running the App

1. **Start the Expo development server**:
   ```
   npx expo start
   ```

2. **Run on device/emulator**:
   - For Android: Press `a` in the terminal or use Expo Go app.
   - For iOS: Press `i` (requires macOS and Xcode).
   - For web: Press `w`.

3. **Build for production** (optional):
   ```
   npx expo build:android
   npx expo build:ios
   ```

## Technologies Used

This project uses the following technologies (mobile app in `location-based-assistance` and backend/db helpers in the repository root and subfolders):

- **Expo & React Native**: `expo`, `react-native`, `react`
- **Navigation & UI**: `@react-navigation/native`, `@react-navigation/stack`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`
- **Location & Maps**: `expo-location`, `react-native-maps`
- **Expo native modules**: `expo-av`, `expo-file-system`, `expo-image-picker`, `expo-network`, `expo-sms`, `expo-speech`, `expo-sqlite`, `expo-status-bar`
- **Voice / Audio**: `react-native-voice`, `@react-native-community/voice`, `@react-native-voice/voice`
- **Firebase**: `firebase`, `@react-native-firebase/app`, `@react-native-firebase/firestore`
- **Backend / Server**: `express`, `cors`, `axios`
- **Databases / ORM**: `sqlite3`, `react-native-sqlite-storage`, `expo-sqlite`, `sequelize`
- **Web / Media**: `react-native-webview`, `react-native-youtube-iframe`, `expo-av`
- **Tooling / Dev**: `expo-cli`, `@babel/core`, `yarn`

For details on where these are used in the codebase, see `TECHNOLOGIES.md`.
