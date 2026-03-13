# Contributing

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 22+](https://nodejs.org/)

## Getting started

1. Clone the repository
2. Build the frontend:
   ```bash
   cd src/Umbraco.Community.uAccessible/Client
   npm install
   npm run build
   ```
3. Run the test site:
   ```bash
   cd src/Umbraco.Community.uAccessible.TestSite
   dotnet run
   ```
4. For frontend hot reload, use watch mode:
   ```bash
   npm run watch
   ```

## Project Structure

- `src/Umbraco.Community.uAccessible/` — the package (Razor Class Library)
  - `Client/` — TypeScript/Lit frontend (Vite)
  - `Controllers/` — Backoffice API controllers
  - `Services/` — A11y scan service (Playwright + axe-core)
  - `Composers/` — Umbraco composer registrations
  - `Models/` — C# result models
- `src/Umbraco.Community.uAccessible.TestSite/` — test/development Umbraco site

## Submitting changes

Please open a pull request with a clear description of your changes.
