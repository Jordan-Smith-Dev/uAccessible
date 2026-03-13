# uAccessible for Umbraco

Adds an **Accessibility** tab to every content node in the Umbraco backoffice. Clicking the tab runs a live axe-core accessibility audit against the last published version of the page and displays a graded report with violations, affected elements, WCAG tags, and remediation guidance.

## Requirements

- Umbraco 17+
- .NET 10+
- PowerShell (for Playwright browser install — included with Windows; available via `brew install powershell` on macOS/Linux)

## Installation

### 1. Add the NuGet package

```bash
dotnet add package Umbraco.Community.uAccessible
```

### 2. Install Chromium (one-time per server)

uAccessible uses Microsoft Playwright to run a headless browser for each scan. After your first build, run:

**Windows / PowerShell:**
```powershell
pwsh bin/Debug/net10.0/playwright.ps1 install chromium
```

**Linux (installs OS dependencies too):**
```bash
pwsh bin/Debug/net10.0/playwright.ps1 install --with-deps chromium
```

The `playwright.ps1` script is placed in your bin folder automatically by the `Microsoft.Playwright` NuGet package during build.

### 3. Done

No configuration required. Restart your site and the **uAccessible** tab appears on every content node.

## CI/CD

Add Chromium install to your deployment pipeline:

```yaml
# GitHub Actions
- name: Install Chromium for uAccessible
  run: pwsh $DOTNET_ROOT/tools/playwright.ps1 install --with-deps chromium
```

## How it works

1. Click the **uAccessible** tab on any content node.
2. uAccessible resolves the node's published URL.
3. A headless Chromium browser loads the page and runs axe-core.
4. A graded report (A–F) shows violations, impact levels, affected HTML, CSS selectors, and WCAG criteria.

> The page must be published and reachable from the server running Umbraco.

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).
