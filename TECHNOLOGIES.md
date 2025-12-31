# Technologies and Where They Are Used

This file lists the main technologies used in the project and the locations/files where they appear.

- Expo & React Native
  - Used by the mobile app in `location-based-assistance/` (entry: `App.js`).

- Navigation & UI
  - `@react-navigation/*`: used in `location-based-assistance/Screens/*` for navigation between screens.
  - `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`: UI helpers used throughout screens and navigation setup.

- Location & Maps
  - `expo-location`: used in screens where geolocation is required (e.g., `Home.js`, address/nearby services).
  - `react-native-maps`: map views (where maps are rendered).

- Expo native modules
  - `expo-av`, `expo-file-system`, `expo-image-picker`, `expo-network`, `expo-sms`, `expo-speech`, `expo-sqlite`, `expo-status-bar`: used in various `Screens/` and helper modules to access device features.

- Voice / Audio
  - `react-native-voice`, `@react-native-community/voice`, `@react-native-voice/voice`: voice recognition features used in the app's voice-related screens.

- Firebase
  - `firebase`, `@react-native-firebase/*`: used in `firebase.js` and for Firestore usage where present.

- Backend / Server
  - `express`, `cors`, `axios`: server and API helper usage; `express` appears in project dependencies for backend helper scripts.

- Databases / ORM
  - `sqlite3`, `react-native-sqlite-storage`, `expo-sqlite`: local storage options used by the mobile app.
  - `sequelize`: present as an ORM dependency.

- Web / Media
  - `react-native-webview`, `react-native-youtube-iframe`, `expo-av`: used for rendering web content and media playback in screens.

- Tooling / Dev
  - `expo-cli`, `@babel/core`, `yarn`: development and build tooling.