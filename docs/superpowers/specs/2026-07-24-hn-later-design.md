# HN Later Design

## Goal

Build an Android-first Expo app for reading Hacker News quickly, saving stories locally for later, and navigating long comment threads comfortably.

## MVP Scope

- Expo Router app with three bottom tabs: Accueil, Read Later, Reglages.
- Home lists Top, Best, New, Ask, Show, and Jobs stories from the official Hacker News Firebase API.
- Story details show metadata, external-link actions, Read Later toggle, and discussion entry.
- Discussions render HTML comments with indentation, collapse/expand, top-level jump controls, and deep replies collapsed by default.
- Read Later persists locally with unread/read status, search, filters, sorting, and remove actions.
- Settings stores font scale and link-opening preference locally.
- GitHub Actions installs dependencies, typechecks/tests, prebuilds Android, builds a debug APK with Gradle, and uploads it as an artifact.

## Architecture

The app uses Expo Router for screen structure, React Query for HN network cache, MMKV-backed storage for local state, FlashList for story and comment lists, and small focused TypeScript modules for pure logic. Native-only MMKV access is wrapped so tests can run with an in-memory adapter.

## Visual Direction

The interface is dark-only and reader-first. The palette is near-black graphite, muted ink surfaces, soft gray text, and Hacker News orange only for active states and primary actions. The signature visual device is a slim orange "saved/read" rail and dense story numbering, echoing Hacker News ranking while staying closer to Linear and Readwise Reader than the web site.

## Testing

Unit tests cover HN item normalization, Read Later persistence and filters, comment flattening/collapse behavior, and time/domain utilities. The CI typechecks and runs the Jest suite before Android build.
