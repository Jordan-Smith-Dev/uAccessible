export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "uAccessible Workspace View",
    alias: "Umbraco.Community.uAccessible.WorkspaceView",
    type: "workspaceView",
    js: () => import("./workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "uAccessible",
      pathname: "uaccessible",
      icon: "icon-eye",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document",
      },
    ],
  },
];
