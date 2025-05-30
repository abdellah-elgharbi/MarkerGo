# MarkerGo

MarkerGo is a shop application designed to make it easy for users to sell and buy items. Built with React Native and Expo, MarkerGo provides a cross-platform experience and leverages modern libraries for seamless navigation, Firebase integration, and more.

## Project Purpose

MarkerGo is a simple marketplace app that allows users to:
- List items for sale
- Browse and purchase items from other users

## Features

- Sell products: Easily list items you want to sell.
- Buy products: Browse available items and make purchases.
- Built with React Native and Expo for cross-platform support.
- Uses Expo Router for smooth navigation.
- Firebase integration for backend and data storage.

## Project Structure

```
.
├── android/              # Android native files
├── app/                  # Main application source
├── assets/               # Images and static assets
├── components/           # React Native components
├── context/              # Context providers (state management)
├── data/                 # Data files or modules
├── firebase/             # Firebase configuration and hooks
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── .bolt/                # Bolt configuration (if used)
├── .gitignore
├── .npmrc
├── .prettierrc
├── app.json              # Expo app configuration
├── package.json          # Project manifest and dependencies
├── package-lock.json
├── tsconfig.json         # TypeScript configuration
└── context.rar           # (Possibly an archive of context files)
```

## Getting Started

### Prerequisites

- Node.js & npm
- Expo CLI (`npm install -g expo-cli`)

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm run dev
```

### Build for Web

```bash
npm run build:web
```

## Scripts

- `dev` - Start Expo development server
- `build:web` - Export app for web
- `lint` - Lint the project using Expo

## Dependencies

MarkerGo leverages a variety of popular libraries, including:

- React Native
- Expo (with plugins: fonts, haptics, camera, etc.)
- Firebase
- Lucide React Native
- Expo Router
- React Navigation
- Chart Kit

See [`package.json`](./package.json) for the full list.

## Configuration

- App configuration is in [`app.json`](./app.json).
- TypeScript configuration is in [`tsconfig.json`](./tsconfig.json).

## License

Specify your license here.

---

> **Note**: This README is generated based on the detected project structure and available files. For more details, visit the [repository](https://github.com/abdellah-elgharbi/MarkerGo).
