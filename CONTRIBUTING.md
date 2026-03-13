# Contributing to uAccessible

Thanks for your interest in contributing. Below is everything you need to get the project running locally.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- PowerShell (for Playwright browser install)
- A browser (for the Umbraco backoffice)

## Repository layout

```
src/
  Umbraco.Community.uAccessible/          # The NuGet package project
    Client/                               # Lit/Vite frontend
      src/
        workspace-views/workspace-view.element.ts
    Controllers/                          # ASP.NET Core Management API
    Services/                             # AxeScanService (Playwright + axe-core)
    Models/                               # AuditResult, ViolationDetail
    Composers/                            # DI registration
    wwwroot/App_Plugins/                  # Built frontend output (committed)
  Umbraco.Community.uAccessible.TestSite/ # Local Umbraco site for testing
docs/
  README_nuget.md                         # README that ships inside the NuGet package
```

## Running locally

### 1. Build the frontend

```bash
cd src/Umbraco.Community.uAccessible/Client
npm ci
npm run build
```

The built output lands in `../wwwroot/App_Plugins/UmbracoCommunityuAccessible/`.

For live-reload during frontend development:

```bash
npm run dev
```

Vite will watch for changes and rebuild to wwwroot automatically.

### 2. Install Chromium

uAccessible uses Playwright to run a headless browser for each scan. After the first build, install Chromium once:

```bash
pwsh src/Umbraco.Community.uAccessible/bin/Debug/net10.0/playwright.ps1 install chromium
```

On Linux, add `--with-deps` to also install OS-level dependencies.

### 3. Run the test site

```bash
cd src/Umbraco.Community.uAccessible.TestSite
dotnet run
```

The site starts at `https://localhost:44345` (HTTPS) / `http://localhost:44137` (HTTP).

On first run, Umbraco installs itself against a local SQLite database. Log in with:

- **Username:** `admin@example.com`
- **Password:** `1234567890`

### 4. Testing in the backoffice

1. Publish a content node (the audit requires a published URL)
2. Open the content node and click the **Accessibility** tab
3. The scan runs immediately and results appear in the tab

## Making changes

### Backend (C#)

Edit files under `Controllers/`, `Services/`, or `Models/`, then restart the test site with `dotnet run`.

### Frontend (TypeScript / Lit)

Edit files under `Client/src/`, then either:

- Run `npm run build` and refresh the browser, or
- Run `npm run dev` for automatic rebuilds

## Releasing

Releases are triggered by pushing a semver tag:

```bash
git tag 1.0.1
git push origin 1.0.1
```

The [release workflow](.github/workflows/release.yml) will:

1. Build the frontend (`npm ci && npm run build`)
2. Pack the NuGet package (`dotnet pack`)
3. Push to NuGet.org

Make sure `NUGET_API_KEY` is set in the repository secrets before pushing a tag.

## Code style

- Backend: standard C# conventions, nullable enabled
- Frontend: TypeScript strict mode, Lit web components, no external state libraries
- Keep the workspace view self-contained — no shared state between components

## Issues and pull requests

Please open an issue before starting significant work so we can discuss the approach. For small fixes, a PR is welcome directly.
