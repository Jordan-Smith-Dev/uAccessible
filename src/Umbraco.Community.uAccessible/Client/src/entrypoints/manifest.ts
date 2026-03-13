export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "uAccessible Entrypoint",
    alias: "Umbraco.Community.uAccessible.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
