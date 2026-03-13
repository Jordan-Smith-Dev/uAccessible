== uAccessible — Frontend Development ==

== Requirements ==
* Node.js 22+
* Use a tool such as NVM (Node Version Manager) for your OS to help manage multiple versions of Node
  * https://github.com/coreybutler/nvm-windows (Windows)
  * https://github.com/nvm-sh/nvm (macOS/Linux)

== Steps ==
* Open a terminal inside the `Client\` folder
* Run `npm install` to install all the dependencies
* Run `npm run build` to build the project
* The build output is copied to `wwwroot\App_Plugins\UmbracoCommunityuAccessible\`

== File Watching ==
* Add this Razor Class Library as a project reference to the TestSite project
* From the `Client\` folder run `npm run watch` to monitor changes to *.ts files and rebuild automatically
* With the Umbraco site running, the browser will refresh when the build is complete

== Playwright / Chromium ==
* After building the project for the first time, install the Chromium browser:
  pwsh bin\Debug\net10.0\playwright.ps1 install chromium
* On Linux, add --with-deps to also install OS-level browser dependencies

== Suggestion ==
* Use VSCode as the editor of choice — it has good TypeScript tooling and Lit web component completions

== Other Resources ==
* Umbraco Docs — https://docs.umbraco.com/umbraco-cms/customizing/overview
* axe-core — https://github.com/dequelabs/axe-core
* Microsoft Playwright — https://playwright.dev/dotnet
