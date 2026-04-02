# Publish LifeOS Preview on GitHub Pages

This setup is already prepared in the project.
The file `.github/workflows/deploy-pages.yml` will publish the `web-preview/` folder to GitHub Pages.

## What you need to do once

1. Create a new empty GitHub repository, for example `lifeos-preview`
2. In PowerShell open:

```powershell
cd C:\Users\janek\Documents\life.app
git init
git branch -M main
git add .
git commit -m "Initial LifeOS preview"
git remote add origin https://github.com/jahulec/lifeos-preview.git
git push -u origin main
```

3. In GitHub open the repo settings:
   `Settings > Pages`
4. Set source to:
   `GitHub Actions`

After the first push GitHub should publish automatically.

## Final URL

It will usually be:

`https://jahulec.github.io/lifeos-preview/`

## Add to iPhone

1. Open the URL in Safari on iPhone
2. Tap `Share`
3. Tap `Add to Home Screen`

## Important note

This publishes the web preview only.
The native SwiftUI iOS app in `LifeOS/` still needs a Mac and Xcode to build.
