import type {
  UmbEntryPointOnInit,
  UmbEntryPointOnUnload,
} from "@umbraco-cms/backoffice/extension-api";

// Auth token setup is handled per-request directly in the workspace view.
// This entry point is reserved for any future global setup needs.
export const onInit: UmbEntryPointOnInit = (_host, _extensionRegistry) => {};

export const onUnload: UmbEntryPointOnUnload = (_host, _extensionRegistry) => {};
