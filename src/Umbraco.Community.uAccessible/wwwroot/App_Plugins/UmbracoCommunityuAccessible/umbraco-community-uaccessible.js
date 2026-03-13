const e = [
  {
    name: "uAccessible Entrypoint",
    alias: "Umbraco.Community.uAccessible.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-BbtUKYiT.js")
  }
], s = [
  {
    name: "uAccessible Workspace View",
    alias: "Umbraco.Community.uAccessible.WorkspaceView",
    type: "workspaceView",
    js: () => import("./workspace-view.element-ByQ1pvne.js"),
    weight: 90,
    meta: {
      label: "uAccessible",
      pathname: "uaccessible",
      icon: "icon-eye"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document"
      }
    ]
  }
], i = [
  ...e,
  ...s
];
export {
  i as manifests
};
//# sourceMappingURL=umbraco-community-uaccessible.js.map
