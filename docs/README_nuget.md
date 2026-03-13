# uAccessible

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.uAccessible?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.uAccessible/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.uAccessible?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.uAccessible)
[![GitHub license](https://img.shields.io/github/license/Jordan-Smith-Dev/uAccessible?color=8AB803)](https://github.com/Jordan-Smith-Dev/uAccessible/blob/main/LICENSE)

Accessibility audit reports for your Umbraco content pages — directly inside the backoffice.

uAccessible adds an **Accessibility** tab to every content node workspace. Clicking it launches a headless Chromium browser, runs a full [axe-core](https://github.com/dequelabs/axe-core) audit against the last published version of the page, and returns a graded report with violations, remediation guidance, WCAG success criteria, and affected HTML elements — without leaving the backoffice.

## Features

- **Accessibility workspace tab** — audit the page you're editing without leaving the content node
- **A–F accessibility grade** — at-a-glance score based on violation count and severity
- **Violations** — each failing rule shown with impact level (Critical / Serious / Moderate / Minor), WCAG success criteria tags, affected HTML elements with CSS selectors, and a direct link to the axe-core remediation guide
- **Quick wins panel** — surfaces the lowest-effort, highest-impact fixes first
- **Needs manual review** — items axe-core could not fully determine automatically, requiring human judgement
- **Passing checks** — collapsible list of all rules that passed, so you can see what's already in good shape
- **WCAG 2.0 / 2.1 / 2.2 coverage** — Levels A and AA, powered by axe-core

## What it doesn't do

uAccessible is an automated scanning tool. It is not a substitute for a full accessibility audit.

- **Does not audit unpublished pages** — the page must have a published URL reachable from the server
- **Does not run scheduled or background scans** — audits are on-demand only, triggered from the backoffice tab
- **Does not fix issues** — it identifies and explains problems; remediation is done by your developers
- **Does not catch every accessibility issue** — axe-core detects roughly 30–57% of WCAG issues automatically; keyboard navigation, screen reader compatibility, cognitive accessibility, and many focus-management issues require human testing
- **Does not audit authenticated pages** — pages behind a login or bot-protection (e.g. Cloudflare) cannot be reached by the headless browser
- **Does not guarantee WCAG compliance** — a clean report means no automatically detectable violations were found, not that the page is fully conformant
- **Does not test across multiple browsers** — scans run in Chromium only

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

For a **Release** build, substitute `Debug` with `Release` in the path above.

### 3. Done

No `appsettings.json` changes or additional configuration required. Restart your site and the **Accessibility** tab will appear on every content node.

## CI/CD & production deployments

Add the Chromium install step to your pipeline so it runs once after each new deployment:

**GitHub Actions:**
```yaml
- name: Install Chromium for uAccessible
  run: pwsh $DOTNET_ROOT/tools/playwright.ps1 install --with-deps chromium
```

**Azure DevOps:**
```yaml
- script: pwsh $(Agent.ToolsDirectory)/playwright.ps1 install --with-deps chromium
  displayName: Install Chromium for uAccessible
```

> **Note:** Playwright spins up a real Chromium process for each scan. Ensure your production server has sufficient memory headroom (typically 512 MB+). On Linux, `--with-deps` installs the required system libraries automatically.

## How it works

1. You open a content node in the Umbraco backoffice and click the **Accessibility** tab.
2. uAccessible resolves the node's published URL via Umbraco's URL provider.
3. A headless Chromium browser loads the live published page and runs an axe-core audit.
4. Results are returned immediately as a structured report — no background jobs or scheduled tasks involved.

## Source & Issues

- GitHub: https://github.com/Jordan-Smith-Dev/uAccessible
- Issues: https://github.com/Jordan-Smith-Dev/uAccessible/issues
