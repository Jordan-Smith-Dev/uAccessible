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
    js: () => import("./workspace-view.element-B4zzmSwc.js"),
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
  {
    name: "uAccessible Dashboard",
    alias: "Umbraco.Community.uAccessible.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-0vBR6oWt.js"),
    meta: {
      label: "uAccessible",
      pathname: "uaccessible"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], a = [
  ...e,
  ...s,
  ...i
];
export {
  a as manifests
};
//# sourceMappingURL=umbraco-community-uaccessible.js.map
