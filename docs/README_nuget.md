# uAccessible

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.uAccessible?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.uAccessible/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.uAccessible?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.uAccessible)
[![GitHub license](https://img.shields.io/github/license/Jordan-Smith-Dev/uAccessible?color=8AB803)](https://github.com/Jordan-Smith-Dev/uAccessible/blob/main/LICENSE)
[![Umbraco Marketplace](https://img.shields.io/badge/Umbraco-Marketplace-%233544B1?logo=umbraco)](https://marketplace.umbraco.com/package/umbraco.community.uaccessible)

Accessibility audit reports for your Umbraco content pages — directly inside the backoffice.

uAccessible adds an **Accessibility** tab to every content node workspace. Clicking it launches a headless Chromium browser, runs a full [axe-core](https://github.com/dequelabs/axe-core) audit against the last published version of the page, and returns a graded report with violations, remediation guidance, WCAG success criteria, and affected HTML elements — without leaving the backoffice.

![uAccessible workspace tab showing accessibility audit results](https://raw.githubusercontent.com/Jordan-Smith-Dev/uAccessible/main/docs/uAccessible_preview-001.png)

## Features

- **Accessibility workspace tab** — audit the page you're editing without leaving the content node
- **A–F accessibility grade** — at-a-glance score based on violation count and severity
- **Violations** — each failing rule shown with impact level (Critical / Serious / Moderate / Minor), WCAG success criteria tags, affected HTML elements with CSS selectors, failure reasons colour-coded by severity, and a direct link to the axe-core remediation guide
- **Quick wins panel** — surfaces the lowest-effort, highest-impact fixes first
- **Needs manual review** — items axe-core could not fully determine automatically, requiring human judgement
- **Passing checks** — collapsible section showing all rules that passed, with the specific criteria each element satisfied and CSS selectors for every checked element
- **Collapse / expand controls** — collapse all cards at once or toggle individual sections (Violations, Needs manual review, Passing checks) independently
- **WCAG 2.0 / 2.1 / 2.2 coverage** — Levels A and AA, powered by axe-core

## Requirements

- Umbraco 17+
- .NET 10+
- PowerShell (for Playwright browser install — included with Windows; available via `brew install powershell` on macOS/Linux)

## Installation

### 1. Add the NuGet package

```bash
dotnet add package Umbraco.Community.uAccessible
```

### 2. Install the Chromium browser (one-time per server)

uAccessible uses Microsoft Playwright to drive a headless browser for each scan. After your first build, run:

**Windows / PowerShell:**
```powershell
pwsh bin/Debug/net10.0/playwright.ps1 install chromium
```

**Linux (Ubuntu/Debian — installs OS dependencies too):**
```bash
pwsh bin/Debug/net10.0/playwright.ps1 install --with-deps chromium
```

**macOS:**
```bash
pwsh bin/Debug/net10.0/playwright.ps1 install chromium
```

For a **Release** build, substitute `Debug` with `Release` in the path above. For CI/CD pipelines, add this step once after each deployment — e.g. `pwsh $DOTNET_ROOT/tools/playwright.ps1 install --with-deps chromium` on GitHub Actions.

### 3. Done

No `appsettings.json` changes or additional configuration required. Restart your site and the **Accessibility** tab will appear on every content node.

## Usage

1. Open any **published** content node in the Umbraco backoffice
2. Click the **Accessibility** tab
3. uAccessible resolves the published URL, launches a headless Chromium browser, and runs a full axe-core scan
4. Results are returned immediately as a graded report — violations, manual review items, and passing checks are all listed with full detail

> **Note:** The page must be published and publicly accessible for the scan to work. Pages behind a login or bot-protection cannot be reached by the headless browser.

## Source & Issues

- GitHub: https://github.com/Jordan-Smith-Dev/uAccessible
- Issues: https://github.com/Jordan-Smith-Dev/uAccessible/issues
