# LifeOS

Personal iPhone-first life operating system built in SwiftUI and SwiftData.

## What is included

- Native iOS app scaffold with the five main product areas:
  - `Today`
  - `Zones`
  - `Capture`
  - `Insights`
  - `Me`
- V1 data model for:
  - fitness
  - habits
  - tasks
  - goals and progress snapshots
  - nutrition, supplements, body metrics, notes
- Sample data seeding so the app is useful on first launch
- Starter integrations for:
  - `HealthKit`
  - `LocalAuthentication` app lock
  - `App Intents` quick capture shortcuts
  - `WidgetKit` today widget

## How to run

This repo was scaffolded on Windows, so the Xcode project itself is not generated here.

### Windows preview

You can run the product preview on Windows without any build tools.

1. Open `web-preview/index.html` in a browser
2. Or run `.\open-preview.ps1` from PowerShell

The preview includes:

- tab navigation
- live progress updates
- habit and task toggles
- quick capture forms
- local persistence through `localStorage`
- installable PWA manifest and service worker

### Publish on GitHub Pages

The project already includes a GitHub Actions workflow for Pages deployment:

- [deploy-pages.yml](C:/Users/janek/Documents/life.app/.github/workflows/deploy-pages.yml)
- [DEPLOY-GITHUB-PAGES.md](C:/Users/janek/Documents/life.app/DEPLOY-GITHUB-PAGES.md)

### Native iOS app

1. Open the folder on a Mac.
2. Install `XcodeGen` if needed: `brew install xcodegen`
3. Run `xcodegen generate`
4. Open `LifeOS.xcodeproj`
5. Build with Xcode 16+ targeting iOS 17+

## Current scope

Implemented now:

- polished SwiftUI shell and navigation
- local-first SwiftData models
- sample seeded data for a realistic first run
- daily dashboard, quick capture, insights and profile screens
- roadmap placeholders for finance and guitar zones

Not fully implemented yet:

- full workout session editor flow
- persistent HealthKit sync
- full notification scheduling
- export/import pipeline
- production widget data bridge
- Apple Watch companion
