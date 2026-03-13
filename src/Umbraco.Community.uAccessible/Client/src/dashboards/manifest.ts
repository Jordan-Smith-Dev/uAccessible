export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "uAccessible Dashboard",
    alias: "Umbraco.Community.uAccessible.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "uAccessible",
      pathname: "uaccessible",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
    ],
  },
];
