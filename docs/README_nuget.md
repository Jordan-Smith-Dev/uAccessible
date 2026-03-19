# uAccessible

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.uAccessible?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.uAccessible/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.uAccessible?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.uAccessible)
[![GitHub license](https://img.shields.io/github/license/Jordan-Smith-Dev/uAccessible?color=8AB803)](https://github.com/Jordan-Smith-Dev/uAccessible/blob/main/LICENSE)
[![Umbraco Marketplace](https://img.shields.io/badge/Umbraco-Marketplace-%233544B1?logo=umbraco)](https://marketplace.umbraco.com/package/umbraco.community.uaccessible)

Accessibility audit reports for your Umbraco content pages — directly inside the backoffice.

uAccessible adds an **Accessibility** tab to every content node workspace. Clicking it launches a headless Chromium browser, runs a full [axe-core](https://github.com/dequelabs/axe-core) audit against the last published version of the page, and returns a graded report with violations, remediation guidance, WCAG success criteria, and affected HTML elements — without leaving the backoffice.

![uAccessible workspace tab showing accessibility audit results](https://raw.githubusercontent.com/Jordan-Smith-Dev/uAccessible/main/docs/uAccessible_preview-001.png)

![uAccessible site-wide audit dashboard with page results](https://raw.githubusercontent.com/Jordan-Smith-Dev/uAccessible/main/docs/uAccessible_preview-002.png)

![uAccessible workspace tab showing a historical scan with grade, stat cards, and Quick Wins](https://raw.githubusercontent.com/Jordan-Smith-Dev/uAccessible/main/docs/uAccessible_preview-003.png)

![uAccessible workspace scan history with Load, Export CSV, and Delete actions](https://raw.githubusercontent.com/Jordan-Smith-Dev/uAccessible/main/docs/uAccessible_preview-004.png)

## Features

- **Accessibility workspace tab** — audit the page you're editing without leaving the content node
- **A–F accessibility grade** — at-a-glance score (0–100) based on violation count and severity
- **WCAG level badges** — each violation is tagged A, AA, AAA, or Best Practice at a glance
- **Violations** — each failing rule shown with impact level (Critical / Serious / Moderate / Minor), WCAG success criteria tags, affected HTML elements with CSS selectors, failure reasons colour-coded by severity, and a direct link to the axe-core remediation guide
- **Quick wins panel** — surfaces the lowest-effort, highest-impact fixes first
- **Needs manual review** — items axe-core could not fully determine automatically, requiring human judgement
- **Passing checks** — collapsible section showing all rules that passed, with the specific criteria each element satisfied and CSS selectors for every checked element
- **Scan history** — per-page history of the last 10 audits with score, grade, and full violation breakdown (Critical / Serious / Moderate / Minor / Passes); load any historical report in full, export individual history entries as CSV, or delete entries; persisted across restarts
- **CSV export** — export violations for the current scan or any historical entry to a CSV file
- **Collapse / expand controls** — collapse all cards at once or toggle individual sections independently
- **Site-wide audit dashboard** — pick any content node and scan it plus all descendants; summary stat cards, sortable page results table with depth indicators and content-type icons, and CSV export
- **Site-wide audit history** — history of past site audits with average score, violation totals, and page counts; load any previous full site report or export it as CSV
- **Navigate to workspace** — jump from any page in a site audit result directly to that page's workspace accessibility tab with the report pre-loaded
- **Concurrent scan protection** — duplicate scans of the same page or tree are blocked with a clear in-progress warning
- **Exclusions config** — exclude document types or specific content keys from site-wide scans via `appsettings.json`
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

No `appsettings.json` changes are required. Restart your site and the **Accessibility** tab will appear on every content node.

**Optional:** To exclude document types or specific pages from site-wide scans, add the following to `appsettings.json`:

```json
"uAccessible": {
  "ExcludedDocumentTypes": ["robotsTxt", "redirects"],
  "ExcludedContentKeys": ["00000000-0000-0000-0000-000000000000"]
}
```

## Usage

1. Open any **published** content node in the Umbraco backoffice
2. Click the **Accessibility** tab
3. uAccessible resolves the published URL, launches a headless Chromium browser, and runs a full axe-core scan
4. Results are returned immediately as a graded report — violations, manual review items, and passing checks are all listed with full detail

> **Note:** The page must be published and publicly accessible for the scan to work. Pages behind a login or bot-protection cannot be reached by the headless browser.

## Source & Issues

- GitHub: https://github.com/Jordan-Smith-Dev/uAccessible
- Issues: https://github.com/Jordan-Smith-Dev/uAccessible/issues
