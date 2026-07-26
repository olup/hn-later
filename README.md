# HN Later

HN Later is an Android-first Hacker News reader built with Expo, React Native, TypeScript, Expo Router, React Query, MMKV, and FlashList.

## Features

- Dark-only Hacker News reader with Top, Best, New, Ask, Show, and Jobs categories.
- Hacker News search powered by the public Algolia HN API.
- Story detail screen with comments, sharing, external link opening, and Read Later actions.
- Comment reader with indentation, collapse/expand, deep replies collapsed by default, and floating jump controls for top-level branches.
- Local Read Later list with unread/read state, search, filters, sorting, and remove actions.
- Local settings for font size and link-opening preference.
- GitHub Actions installable APK build without EAS.
- In-app GitHub Releases update checker that can download the latest APK and launch Android's installer.

## Local Development

Install dependencies:

```bash
npm ci
```

Start Expo:

```bash
npm start
```

Run checks:

```bash
npm test
npm run typecheck
```

Generate the Android native project:

```bash
npm run prebuild:android
```

Build an installable APK locally:

```bash
npm run build:android:release
```

The APK is written under `android/app/build/outputs/apk/release/`.

## Architecture

- `app/`: Expo Router screens and tab/stack layout.
- `src/api/`: official Hacker News Firebase API client and normalizers.
- `src/api/algolia.ts`: public Algolia HN search client and result normalizer.
- `src/storage/`: MMKV-backed Read Later and settings stores.
- `src/hooks/`: React Query and local-state hooks.
- `src/components/`: reusable mobile UI components.
- `src/utils/`: pure formatting and comment-tree utilities.
- `src/models/`: shared TypeScript domain types.

## CI

Every push to `main` runs tests, typecheck, stamps the app version as `1.0.<run_number>`, runs Expo Android prebuild, builds a Gradle release APK, uploads the installable APK as a GitHub Actions artifact, and publishes it to GitHub Releases.
