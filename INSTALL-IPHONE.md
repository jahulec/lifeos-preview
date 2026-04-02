# Install on iPhone from Windows

You cannot install the native SwiftUI iOS app from Windows alone.
What you can install right now is the `LifeOS` web preview as a home screen web app.

## Requirements

- Windows PC and iPhone on the same Wi-Fi network
- Safari on iPhone

## Steps

1. Open PowerShell in `C:\Users\janek\Documents\life.app`
2. Run:

```powershell
.\serve-preview.ps1
```

If PowerShell blocks the script, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve-preview.ps1
```

3. In the terminal output, copy the `http://<your-ip>:4173` address
4. On your iPhone, open that address in Safari
5. Tap `Share`
6. Tap `Add to Home Screen`

## What this gives you

- home screen icon
- standalone app-like window
- saved local state in the browser
- offline shell after first load

## Important limitation

This is the web preview, not the native iOS build.
For the real native app in `LifeOS/`, you still need a Mac with Xcode.
