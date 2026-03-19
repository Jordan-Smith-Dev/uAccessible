import { LitElement as L, html as t, nothing as l, css as H, state as p, customElement as T } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as j } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as R } from "@umbraco-cms/backoffice/document";
import { UMB_AUTH_CONTEXT as B } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as q } from "@umbraco-cms/backoffice/notification";
var D = Object.defineProperty, O = Object.getOwnPropertyDescriptor, d = (e, s, a, o) => {
  for (var r = o > 1 ? void 0 : o ? O(s, a) : s, i = e.length - 1, u; i >= 0; i--)
    (u = e[i]) && (r = (o ? u(s, a, r) : u(r)) || r);
  return o && r && D(s, a, r), r;
};
const b = "/umbraco/umbracommunityuaccessible/api/v1", V = ["critical", "serious", "moderate", "minor"], C = {
  critical: "#c0392b",
  serious: "#d35400",
  moderate: "#b7770d",
  minor: "#2471a3"
}, S = {
  critical: "rgba(192,57,43,0.12)",
  serious: "rgba(211,84,0,0.12)",
  moderate: "rgba(183,119,13,0.12)",
  minor: "rgba(36,113,163,0.10)"
};
function G(e) {
  switch (e) {
    case "A":
      return "#27ae60";
    case "B":
      return "#2ecc71";
    case "C":
      return "#f39c12";
    case "D":
      return "#e67e22";
    case "F":
      return "#e74c3c";
    default:
      return "#9ca3af";
  }
}
function E(e) {
  switch (e) {
    case "A":
      return { color: "#1a7a4a", ring: "#27ae60" };
    case "B":
      return { color: "#1a6b2a", ring: "#2ecc71" };
    case "C":
      return { color: "#b7770d", ring: "#f39c12" };
    case "D":
      return { color: "#d35400", ring: "#e67e22" };
    case "F":
      return { color: "#c0392b", ring: "#e74c3c" };
    default:
      return { color: "#6b7280", ring: "#9ca3af" };
  }
}
function U(e) {
  const s = {
    "cat.color": "Low vision",
    "cat.keyboard": "Keyboard users",
    "cat.screen-reader": "Screen reader users",
    "cat.structure": "Screen reader users",
    "cat.aria": "Assistive technology users",
    "cat.forms": "All users",
    "cat.text-alternatives": "Screen reader users",
    "cat.tables": "Screen reader users",
    "cat.language": "Screen reader users",
    "cat.time-and-media": "Deaf / hard of hearing",
    "cat.sensory-and-visual-cues": "Low vision",
    "cat.parsing": "Assistive technology users",
    "cat.name-role-value": "Assistive technology users",
    "best-practice": "All users"
  }, a = /* @__PURE__ */ new Set();
  for (const o of e)
    s[o] && a.add(s[o]);
  return [...a];
}
function M(e) {
  switch (e) {
    case "minor":
      return "Low";
    case "moderate":
      return "Medium";
    case "serious":
    case "critical":
      return "High";
    default:
      return "Unknown";
  }
}
const I = [
  { icon: "🔍", message: "Launching headless browser…" },
  { icon: "📄", message: "Loading the published page…" },
  { icon: "🌈", message: "Checking colour contrast ratios…" },
  { icon: "🏷️", message: "Inspecting ARIA roles and labels…" },
  { icon: "⌨️", message: "Evaluating keyboard navigation paths…" },
  { icon: "🖼️", message: "Scanning for missing alternative text…" },
  { icon: "📐", message: "Analysing heading structure and hierarchy…" },
  { icon: "🔗", message: "Checking link names and focus indicators…" },
  { icon: "📋", message: "Reviewing form labels and error handling…" },
  { icon: "🌍", message: "Verifying language attributes…" },
  { icon: "📊", message: "Auditing table structure and semantics…" },
  { icon: "✨", message: "Tallying violations and passes…" }
], m = t`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
    <path d="M11 13l9 -9" />
    <path d="M15 4h5v5" />
</svg>`, F = t`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M21 2v6h-6"/>
    <path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>
</svg>`, N = t`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
</svg>`, W = t`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`, X = t`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
</svg>`, K = t`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
</svg>`, Q = t`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
</svg>`, Y = t`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    class="reason-icon">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
</svg>`, J = t`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    class="reason-icon reason-icon--pass">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`, Z = t`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>`;
let c = class extends j(L) {
  constructor() {
    super(...arguments), this._loading = !1, this._scanInProgress = !1, this._thinkingIdx = 0, this._thinkingTimer = null, this._result = null, this._error = null, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._activeImpact = null, this._allCollapsed = !1, this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !1, this._history = [], this._historyExpanded = !1, this._historicalDate = null, this._historyLoading = null, this._historicalIndex = null, this._displayScore = 0, this._displayGrade = "?", this._displayColor = { color: "#6b7280", ring: "#9ca3af" }, this._displayViolations = 0, this._displayPasses = 0, this._displayIncomplete = 0, this._displayRules = 0, this._unique = null, this._tokenProvider = null, this._notificationContext = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(B, (e) => {
      this._tokenProvider = (e == null ? void 0 : e.getOpenApiConfiguration().token) ?? null, this._unique && this._history.length === 0 && this._fetchHistory();
    }), this.consumeContext(q, (e) => {
      this._notificationContext = e ?? null;
    }), this.consumeContext(R, async (e) => {
      var a;
      const s = (a = e == null ? void 0 : e.getUnique) == null ? void 0 : a.call(e);
      s && (this._unique = s, this._fetchHistory());
    });
  }
  // -----------------------------------------------------------------------
  // API call
  // -----------------------------------------------------------------------
  _startThinking() {
    this._thinkingIdx = 0, this._thinkingTimer = setInterval(() => {
      this._thinkingIdx = (this._thinkingIdx + 1) % I.length;
    }, 2200);
  }
  _stopThinking() {
    this._thinkingTimer !== null && (clearInterval(this._thinkingTimer), this._thinkingTimer = null);
  }
  async _runAudit() {
    var e, s, a;
    if (this._unique) {
      this._loading = !0, this._startThinking(), this._result = null, this._error = null, this._historicalDate = null, this._historicalIndex = null, this._historyExpanded = !1, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._activeImpact = null, this._allCollapsed = !1, this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !1, this._displayScore = 0, this._displayGrade = "?", this._displayColor = { color: "#6b7280", ring: "#9ca3af" }, this._displayViolations = 0, this._displayPasses = 0, this._displayIncomplete = 0, this._displayRules = 0;
      try {
        const o = this._tokenProvider ? await this._tokenProvider() : void 0, r = await fetch(`${b}/audit/key/${this._unique}`, {
          headers: {
            Accept: "application/json",
            ...o ? { Authorization: `Bearer ${o}` } : {}
          }
        });
        if (r.status === 409) {
          this._scanInProgress = !0, (e = this._notificationContext) == null || e.peek("warning", {
            data: { headline: "Scan already in progress", message: "Another editor is already scanning this page. Check Scan history shortly for the result." }
          });
          return;
        }
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        if (this._scanInProgress = !1, this._result = await r.json(), this._result && !this._result.fetchError) {
          this._fetchHistory(), this._animateScore(this._result.score ?? 0, this._result.grade);
          const i = this._result.violations.length;
          i === 0 ? (s = this._notificationContext) == null || s.peek("positive", {
            data: { headline: "No violations found", message: `Grade ${this._result.grade} — all automated checks passed.` }
          }) : (a = this._notificationContext) == null || a.peek("danger", {
            data: { headline: `${i} violation${i !== 1 ? "s" : ""} found`, message: `Grade ${this._result.grade}` }
          });
        }
      } catch (o) {
        this._error = o instanceof Error ? o.message : "An unexpected error occurred.";
      } finally {
        this._stopThinking(), this._loading = !1;
      }
    }
  }
  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------
  _toggleItem(e, s) {
    const a = new Set(s);
    return a.has(e) ? a.delete(e) : a.add(e), a;
  }
  _toggleAll() {
    this._result && (this._allCollapsed ? (this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !0, this._allCollapsed = !1) : (this._collapsed = new Set(this._result.violations.map((e) => e.id)), this._collapsedIncomplete = new Set(this._result.incomplete.map((e) => e.id)), this._collapsedPasses = new Set(this._result.passingChecks.map((e) => e.id)), this._violationsExpanded = !1, this._reviewExpanded = !1, this._passesExpanded = !1, this._allCollapsed = !0));
  }
  _filteredViolations() {
    if (!this._result) return [];
    const e = this._result.violations;
    return this._activeImpact ? e.filter((s) => s.impact === this._activeImpact) : e;
  }
  _quickWins() {
    if (!this._result) return [];
    const e = ["minor", "moderate", "serious", "critical"];
    return [...this._result.violations].sort((s, a) => {
      const o = e.indexOf(s.impact ?? "minor"), r = e.indexOf(a.impact ?? "minor");
      return o !== r ? o - r : s.nodes.length - a.nodes.length;
    }).slice(0, 5);
  }
  _audiences() {
    if (!this._result) return [];
    const e = /* @__PURE__ */ new Set();
    for (const s of this._result.violations)
      for (const a of U(s.tags)) e.add(a);
    return [...e];
  }
  _uniqueRulesCount() {
    return this._result ? new Set(this._result.violations.map((e) => e.id)).size : 0;
  }
  _wcagTags(e) {
    return e.filter((s) => /^wcag\d+$/.test(s)).map((s) => {
      const a = s.replace("wcag", "");
      return a.length === 3 ? `SC ${a[0]}.${a[1]}.${a[2]}` : a.length === 4 ? `SC ${a[0]}.${a[1]}.${a.slice(2)}` : `SC ${a}`;
    });
  }
  _wcagLevelLabel(e) {
    return e ? e === "Best Practice" ? "Best Practice" : `WCAG ${e}` : "";
  }
  // Returns true when the target selector is specific enough to be useful in DevTools
  // (i.e. not just a bare tag name like "h4" or "p")
  _isSpecificSelector(e) {
    return /[#.\s>+~\[:]/.test(e);
  }
  _animateScore(e, s) {
    var y, k, $;
    const o = performance.now(), r = E(s), i = ["A", "B", "C", "D", "F"], u = Math.max(0, i.indexOf(s)), n = 25, h = ((u - n) % i.length + i.length) % i.length, v = ((y = this._result) == null ? void 0 : y.summary.totalViolations) ?? 0, _ = ((k = this._result) == null ? void 0 : k.summary.passes) ?? 0, g = (($ = this._result) == null ? void 0 : $.summary.incompleteCount) ?? 0, x = this._uniqueRulesCount(), w = (A) => {
      const P = A - o, z = Math.min(P / 1800, 1), f = 1 - Math.pow(1 - z, 3);
      this._displayScore = Math.round(f * e), this._displayGrade = i[(h + Math.floor(f * n)) % i.length], this._displayViolations = Math.round(f * v), this._displayPasses = Math.round(f * _), this._displayIncomplete = Math.round(f * g), this._displayRules = Math.round(f * x), z < 1 ? requestAnimationFrame(w) : (this._displayScore = e, this._displayGrade = s, this._displayColor = r, this._displayViolations = v, this._displayPasses = _, this._displayIncomplete = g, this._displayRules = x);
    };
    requestAnimationFrame(w);
  }
  async _fetchHistory() {
    if (this._unique)
      try {
        const e = this._tokenProvider ? await this._tokenProvider() : void 0, s = await fetch(`${b}/audit/history/${this._unique}`, {
          headers: {
            Accept: "application/json",
            ...e ? { Authorization: `Bearer ${e}` } : {}
          }
        });
        s.ok ? (this._history = await s.json(), !this._result && this._history.length > 0 && (this._historyExpanded = !0), sessionStorage.getItem("uaccessible:autoload") === this._unique && this._history.length > 0 && (sessionStorage.removeItem("uaccessible:autoload"), this._loadHistoryEntry(0, this._history[0].scannedAt))) : s.status;
      } catch {
      }
  }
  async _loadHistoryEntry(e, s) {
    var a;
    if (this._unique) {
      this._historyLoading = e;
      try {
        const o = this._tokenProvider ? await this._tokenProvider() : void 0, r = await fetch(`${b}/audit/history/${this._unique}/${e}`, {
          headers: {
            Accept: "application/json",
            ...o ? { Authorization: `Bearer ${o}` } : {}
          }
        });
        if (!r.ok) throw new Error(`Failed to load scan (HTTP ${r.status})`);
        const i = await r.json();
        this._result = i, this._historicalDate = s, this._historicalIndex = e, this._historyExpanded = !1, this._activeImpact = null, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !1, i && !i.fetchError && (this._displayScore = i.score, this._displayGrade = i.grade, this._displayColor = E(i.grade), this._displayViolations = i.summary.totalViolations, this._displayPasses = i.summary.passes, this._displayIncomplete = i.summary.incompleteCount, this._displayRules = new Set(i.violations.map((u) => u.id)).size);
      } catch (o) {
        const r = o instanceof Error ? o.message : "Could not load historical scan.";
        (a = this._notificationContext) == null || a.peek("danger", {
          data: { headline: "History load failed", message: r }
        });
      } finally {
        this._historyLoading = null;
      }
    }
  }
  async _deleteHistoryEntry(e) {
    if (this._unique)
      try {
        const s = this._tokenProvider ? await this._tokenProvider() : void 0;
        await fetch(`${b}/audit/history/${this._unique}/${e}`, {
          method: "DELETE",
          headers: s ? { Authorization: `Bearer ${s}` } : {}
        }), await this._fetchHistory();
      } catch {
      }
  }
  async _clearHistory() {
    if (this._unique)
      try {
        const e = this._tokenProvider ? await this._tokenProvider() : void 0;
        await fetch(`${b}/audit/history/${this._unique}`, {
          method: "DELETE",
          headers: e ? { Authorization: `Bearer ${e}` } : {}
        }), this._history = [];
      } catch {
      }
  }
  /** Returns score/violation delta vs the previous scan. Only shown for live (non-historical) results. */
  _delta() {
    if (!this._result || this._historicalDate) return null;
    const e = this._history[1];
    return e ? {
      score: (this._result.score ?? 0) - e.score,
      violations: (this._result.summary.totalViolations ?? 0) - e.violationCount
    } : null;
  }
  _exportCsv() {
    var u;
    if (!this._result) return;
    const e = [
      ["Rule ID", "Impact", "WCAG Level", "Rule Name", "Description", "Elements Affected", "First Selector"]
    ];
    for (const n of this._result.violations)
      e.push([
        n.id,
        n.impact ?? "",
        n.wcagLevel ?? "",
        `"${n.help.replace(/"/g, '""')}"`,
        `"${n.description.replace(/"/g, '""')}"`,
        String(n.nodes.length),
        `"${(((u = n.nodes[0]) == null ? void 0 : u.target) ?? "").replace(/"/g, '""')}"`
      ]);
    const s = e.map((n) => n.join(",")).join(`
`), a = new Blob([s], { type: "text/csv;charset=utf-8;" }), o = URL.createObjectURL(a), r = document.createElement("a");
    r.href = o;
    const i = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
    r.download = `uAccessible-violations-${i}.csv`, r.click(), URL.revokeObjectURL(o);
  }
  async _exportHistoryEntryCsv(e) {
    var s;
    if (this._unique)
      try {
        const a = this._tokenProvider ? await this._tokenProvider() : void 0, o = await fetch(`${b}/audit/history/${this._unique}/${e}`, {
          headers: { Accept: "application/json", ...a ? { Authorization: `Bearer ${a}` } : {} }
        });
        if (!o.ok) return;
        const r = await o.json(), i = [
          ["Rule ID", "Impact", "WCAG Level", "Rule Name", "Description", "Elements Affected", "First Selector"]
        ];
        for (const g of r.violations)
          i.push([
            g.id,
            g.impact ?? "",
            g.wcagLevel ?? "",
            `"${g.help.replace(/"/g, '""')}"`,
            `"${g.description.replace(/"/g, '""')}"`,
            String(g.nodes.length),
            `"${(((s = g.nodes[0]) == null ? void 0 : s.target) ?? "").replace(/"/g, '""')}"`
          ]);
        const u = i.map((g) => g.join(",")).join(`
`), n = new Blob([u], { type: "text/csv;charset=utf-8;" }), h = URL.createObjectURL(n), v = document.createElement("a");
        v.href = h;
        const _ = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
        v.download = `uAccessible-violations-${_}.csv`, v.click(), URL.revokeObjectURL(h);
      } catch {
      }
  }
  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  render() {
    var s, a, o, r;
    if (this._loading) {
      const i = I[this._thinkingIdx];
      return t`
                <div class="loader-alert-wrap">
                    <uui-alert>
                        <p>Running axe-core accessibility audit against the published version of this page — this may take a moment.</p>
                        <div class="thinking-row">
                            <span class="thinking-icon">${i.icon}</span>
                            <span class="thinking-message">${i.message}</span>
                        </div>
                        <div class="scan-progress-track" style="margin-top: 8px;"><div class="scan-progress-fill"></div></div>
                    </uui-alert>
                </div>`;
    }
    const e = ((s = this._result) == null ? void 0 : s.published) && !this._result.fetchError;
    return t`
            <div class="page-header">
                <div class="page-header-main">
                    <div>
                        <h3 class="page-title">
                            uAccessible: Accessibility Auditor
                        </h3>
                        <p class="page-description">
                            Scans the last published version of this page using
                            <strong>axe-core</strong> and reports WCAG 2.0, 2.1 &amp; 2.2
                            violations (Levels A &amp; AA).
                        </p>
                    </div>
                </div>
                <div class="header-actions">
                    ${e && (((o = (a = this._result) == null ? void 0 : a.violations) == null ? void 0 : o.length) ?? 0) > 0 ? t`
                        <uui-button look="outline" compact @click=${this._exportCsv} title="Export violations as CSV">
                            <span class="btn-content">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                    <path d="M8 11h8" />
                                    <path d="M8 15h5" />
                                </svg>
                                Export CSV
                            </span>
                        </uui-button>
                    ` : l}
                    ${e && ((r = this._result) != null && r.url) ? t`
                        <uui-button look="outline"
                            href=${this._result.url}
                            target="_blank"
                            title="Open the published page in a new tab">
                            <span class="btn-content">View page ${m}</span>
                        </uui-button>
                    ` : l}
                    <uui-button
                        look="primary"
                        color="positive"
                        @click=${this._runAudit}
                        ?disabled=${this._loading}
                        title=${this._result ? "Re-run accessibility audit" : "Run accessibility audit"}>
                        <span class="btn-content">
                            ${this._result ? t`Re-run Audit ${F}` : "Run Audit"}
                        </span>
                    </uui-button>
                </div>
            </div>

            ${this._scanInProgress ? t`
                <uui-alert color="warning" headline="Scan already in progress" style="margin-top: var(--uui-size-space-4);">
                    Another editor is already scanning this page. The result will appear in <strong>Scan history</strong> shortly — no need to scan again.
                </uui-alert>
            ` : l}

            ${this._historyLoading !== null ? t`
                <div class="history-load-bar">
                    <uui-loader-circle></uui-loader-circle>
                    <span>Loading historical scan…</span>
                </div>
            ` : l}

            ${this._renderBody()}
        `;
  }
  _renderHistory() {
    return this._history.length === 0 ? l : t`
            <div class="history-section">
                <h4 class="section-heading section-heading--history">
                    <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 8l0 4l2 2" />
                        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                    </svg>
                    Scan history
                    <span class="section-heading-count">
                        (<strong>${this._history.length}</strong>
                        scan${this._history.length !== 1 ? "s" : ""})
                    </span>
                    <uui-button look="outline" compact
                        @click=${() => {
      this._historyExpanded = !this._historyExpanded;
    }}>
                        <span class="btn-content">
                            ${this._historyExpanded ? "Collapse" : "Show"}
                            <svg class="btn-icon chevron-icon ${this._historyExpanded ? "chevron-icon--up" : ""}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                </h4>
                ${this._historyExpanded ? t`
                    <div class="exec-card history-table-card">
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Date of scan</th>
                                    <th>Grade</th>
                                    <th>Score</th>
                                    <th class="th--violations">Violations</th>
                                    <th class="th--critical">Critical</th>
                                    <th class="th--serious">Serious</th>
                                    <th class="th--moderate">Moderate</th>
                                    <th class="th--minor">Minor</th>
                                    <th class="th--passes">Passes</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this._history.map((e) => t`
                                    <tr class="${e.index === 0 ? "history-row--latest" : ""} ${this._historicalIndex === e.index ? "history-row--active" : ""}">
                                        <td>${new Date(e.scannedAt).toLocaleString()}</td>
                                        <td><span class="grade-circle" style="color: ${G(e.grade)};">${e.grade}</span></td>
                                        <td>${e.score}/100</td>
                                        <td><span class="count-badge count-badge--violations">${e.violationCount}</span></td>
                                        <td><span class="count-badge count-badge--critical">${e.criticalCount}</span></td>
                                        <td><span class="count-badge count-badge--serious">${e.seriousCount}</span></td>
                                        <td><span class="count-badge count-badge--moderate">${e.moderateCount ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--minor">${e.minorCount ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--passes">${e.passingCount ?? 0}</span></td>
                                        <td class="history-actions">
                                            <uui-button look="${this._historicalIndex === e.index ? "primary" : "outline"}" compact
                                                class="history-load-btn"
                                                ?disabled=${this._historyLoading === e.index}
                                                @click=${() => this._loadHistoryEntry(e.index, e.scannedAt)}>
                                                ${this._historyLoading === e.index ? t`<uui-loader-circle></uui-loader-circle>` : this._historicalIndex === e.index ? "Loaded" : "Load"}
                                            </uui-button>
                                            <uui-button look="outline" compact
                                                @click=${() => this._exportHistoryEntryCsv(e.index)}
                                                title="Export this scan's violations as CSV">
                                                    <span class="btn-content">
                                                        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                            <path d="M8 11h8" /><path d="M8 15h5" />
                                                        </svg>
                                                        Export CSV
                                                    </span>
                                                </uui-button>
                                            <uui-button look="primary" compact color="danger"
                                                @click=${() => this._deleteHistoryEntry(e.index)}
                                                title="Delete this scan entry">
                                                Delete
                                            </uui-button>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                        <div class="history-footer">
                            <uui-button look="primary" compact color="danger" @click=${this._clearHistory}>
                                Clear all history
                            </uui-button>
                        </div>
                    </div>
                ` : l}
            </div>
        `;
  }
  _renderBody() {
    var u;
    if (this._error)
      return t`<uui-alert color="danger">${this._error}</uui-alert>`;
    if (!this._result)
      return t`
                ${this._renderHistory()}
                <uui-alert>
                    <p class="state-msg">
                        Click <strong>Run Audit</strong> to check this page for accessibility issues against its last published version.
                        ${this._history.length > 0 ? t` Or <strong>load a past scan</strong> from history above.` : l}
                    </p>
                    <p class="state-hint">Powered by axe-core &mdash; checks WCAG 2.0, 2.1 &amp; 2.2 (Levels A &amp; AA)</p>
                </uui-alert>
            `;
    if (!this._result.published)
      return t`
                <uui-alert headline="Page not published">
                    <p class="state-msg">This page hasn't been published yet — there is no public URL to audit.</p>
                    <p class="state-hint">Publish the page from the <strong>Info</strong> tab, then click <strong>Run Audit</strong> above.</p>
                </uui-alert>
            `;
    if (this._result.fetchError)
      return t`
                <uui-alert color="warning" headline="Could not load page">
                    <p class="state-msg">${this._result.fetchError}</p>
                    ${this._result.url ? t`
                        <div class="fetch-url-box">
                            <span class="fetch-url-label">URL attempted</span>
                            <code class="fetch-url-code">${this._result.url}</code>
                        </div>
                    ` : l}
                </uui-alert>
            `;
    const { violations: e, incomplete: s } = this._result, a = this._filteredViolations(), o = this._quickWins(), r = this._audiences(), i = this._delta();
    return t`
            <!-- ── Historical scan context card ── -->
            ${this._historicalDate ? t`
                <div class="exec-card historical-card">
                    <div class="historical-card__header">
                        <svg class="historical-card__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 8l0 4l2 2" />
                            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                        </svg>
                        <div class="historical-card__content">
                            <span class="historical-card__label">Historical scan</span>
                            <span class="historical-card__date">${new Date(this._historicalDate).toLocaleString()}</span>
                            ${this._historicalIndex !== null ? t`
                                <span class="historical-card__meta">Entry ${this._historicalIndex + 1} of ${this._history.length} — not the latest result</span>
                            ` : l}
                        </div>
                        <uui-button look="primary" color="positive" compact @click=${this._runAudit}>
                            Run fresh audit
                        </uui-button>
                    </div>
                </div>
            ` : l}

            <!-- ── Scan history ── -->
            ${this._renderHistory()}

            <!-- ── Grade ring + stat cards row ── -->
            <div class="top-row">
                <!-- Grade ring -->
                <div class="grade-ring-wrap">
                    <div class="grade-ring" style="--ring-color: ${this._displayColor.ring}; --text-color: ${this._displayColor.color}">
                        <span class="grade-ring__letter">${this._displayGrade}</span>
                        <span class="grade-ring__score">${this._displayScore}/100</span>
                    </div>
                    ${i && i.score !== 0 ? t`
                        <span class="grade-delta ${i.score > 0 ? "grade-delta--up" : "grade-delta--down"}">
                            ${i.score > 0 ? "▲" : "▼"} ${Math.abs(i.score)} pts
                        </span>
                    ` : l}
                </div>

                <!-- Stat cards -->
                <div class="stats-row">
                    <div class="stat-card stat-card--violations">
                        <div class="stat-card__icon">${N}</div>
                        <div class="stat-card__info">
                            <div class="stat-card__value-row">
                                <span class="stat-card__value">${this._displayViolations}</span>
                                ${i && i.violations !== 0 ? t`
                                    <span class="delta-badge ${i.violations > 0 ? "delta-badge--down" : "delta-badge--up"}">
                                        ${i.violations > 0 ? "▲" : "▼"}${Math.abs(i.violations)}
                                    </span>
                                ` : l}
                            </div>
                            <span class="stat-card__label">Violations</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--passes">
                        <div class="stat-card__icon">${W}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayPasses}</span>
                            <span class="stat-card__label">Passing</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--review">
                        <div class="stat-card__icon">${X}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayIncomplete}</span>
                            <span class="stat-card__label">Needs Review</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--rules">
                        <div class="stat-card__icon">${K}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayRules}</span>
                            <span class="stat-card__label">Unique Rules</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Filter + collapse all row ── -->
            <div class="filter-row">
                <div class="summary-filters">
                    ${V.map((n) => {
      const h = e.filter((g) => g.impact === n).length, v = this._activeImpact === n, _ = this._activeImpact !== null && !v;
      return t`
                            <button
                                class="impact-pill impact-pill--${n} ${_ ? "impact-pill--dimmed" : ""} ${v ? "impact-pill--active" : ""}"
                                style="--pill-color: ${C[n]}; --pill-bg: ${S[n]}"
                                @click=${() => {
        this._activeImpact = v ? null : n;
      }}
                                title="Filter by ${n} violations">
                                ${n.charAt(0).toUpperCase() + n.slice(1)}: ${h}
                            </button>
                        `;
    })}
                </div>
                ${e.length > 0 || s.length > 0 ? t`
                    <uui-button look="primary" compact @click=${this._toggleAll}>
                        <span class="btn-content">
                            ${this._allCollapsed ? "Expand all" : "Collapse all"}
                            <svg class="btn-icon chevron-icon ${this._allCollapsed ? "chevron-icon--up" : ""}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                ` : l}
            </div>

            ${this._activeImpact ? t`
                <p class="filter-hint">
                    Showing <strong>${this._activeImpact}</strong> violations only &mdash;
                    click the pill again to clear.
                </p>
            ` : l}

            <!-- ── Who is affected + Quick wins ── -->
            ${(o.length > 0 || r.length > 0) && !this._activeImpact ? t`
                <div class="exec-row">
                    ${r.length > 0 ? t`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${Z} Who is affected
                            </h4>
                            <p class="exec-card__subtitle">Accessibility groups impacted by violations on this page</p>
                            <div class="audience-chips">
                                ${r.map((n) => t`
                                    <span class="audience-chip">${n}</span>
                                `)}
                            </div>
                        </div>
                    ` : l}

                    ${o.length > 0 ? t`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${Q} Quick wins
                            </h4>
                            <p class="exec-card__subtitle">Lowest effort fixes — address these first</p>
                            <ul class="quick-wins-list">
                                ${o.map((n) => t`
                                    <li class="quick-win">
                                        <span class="effort-badge effort-badge--${M(n.impact).toLowerCase()}">
                                            ${M(n.impact).toUpperCase()}
                                        </span>
                                        <span class="quick-win__text">
                                            <span class="quick-win__title">${n.help}</span>
                                            <span class="quick-win__nodes">${n.nodes.length} element${n.nodes.length !== 1 ? "s" : ""}</span>
                                        </span>
                                    </li>
                                `)}
                            </ul>
                        </div>
                    ` : l}
                </div>
            ` : l}

            <!-- ── Violations ── -->
            <h4 class="section-heading section-heading--violations">
                <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" viewBox="0 0 24 24">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 9v4" />
                    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
                    <path d="M12 16h.01" />
                </svg>
                Accessibility violations
                <span class="section-heading-count">
                    (<strong>${e.length}</strong>
                    violation${e.length !== 1 ? "s" : ""} found)
                </span>
                <uui-button look="primary" compact @click=${() => {
      this._violationsExpanded = !this._violationsExpanded;
    }}>
                    <span class="btn-content">
                        ${this._violationsExpanded ? "Collapse" : "Show"}
                        <svg class="btn-icon chevron-icon ${this._violationsExpanded ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                    </span>
                </uui-button>
            </h4>

            ${this._violationsExpanded ? t`
                ${e.length === 0 ? t`
                    <uui-alert color="positive" headline="No violations found">
                        <p class="state-msg">This page passed all automated accessibility checks.</p>
                    </uui-alert>
                ` : a.length === 0 ? t`
                    <uui-alert>No ${this._activeImpact} violations on this page.</uui-alert>
                ` : t`
                    <div class="violations-list">
                        ${a.map((n) => this._renderViolation(n, "violations"))}
                    </div>
                `}
            ` : l}

            <!-- ── Incomplete / needs review ── -->
            ${s.length > 0 ? t`
                <h4 class="section-heading section-heading--review" style="margin-top: var(--uui-size-layout-1)">
                    <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M12 9h.01" />
                        <path d="M11 12h1v4h1" />
                    </svg>
                    Needs manual review
                    <span class="section-heading-count">
                        (<strong>${s.length}</strong>
                        item${s.length !== 1 ? "s" : ""} require manual verification)
                    </span>
                    <uui-button look="primary" compact @click=${() => {
      this._reviewExpanded = !this._reviewExpanded;
    }}>
                        <span class="btn-content">
                            ${this._reviewExpanded ? "Collapse" : "Show"}
                            <svg class="btn-icon chevron-icon ${this._reviewExpanded ? "chevron-icon--up" : ""}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                </h4>
                <uui-alert color="warning" headline="Automated tools cannot fully determine these">
                    <p class="state-msg">These checks require a human to verify. axe-core detected a potential issue but cannot confirm whether it is a true violation.</p>
                </uui-alert>
                ${this._reviewExpanded ? t`
                    <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                        ${s.map((n) => this._renderViolation(n, "incomplete"))}
                    </div>
                ` : l}
            ` : l}

            <!-- ── Passing checks ── -->
            ${((u = this._result.passingChecks) == null ? void 0 : u.length) > 0 ? t`
                <h4 class="section-heading section-heading--passes" style="margin-top: var(--uui-size-layout-1)">
                    <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M9 12l2 2l4 -4" />
                    </svg>
                    Passing checks
                    <span class="section-heading-count">
                        (<strong>${this._result.passingChecks.length}</strong>
                        rule${this._result.passingChecks.length !== 1 ? "s" : ""} passed)
                    </span>
                    <uui-button look="primary" compact @click=${() => {
      this._passesExpanded = !this._passesExpanded;
    }}>
                        <span class="btn-content">
                            ${this._passesExpanded ? "Collapse" : "Show"}
                            <svg class="btn-icon chevron-icon ${this._passesExpanded ? "chevron-icon--up" : ""}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                </h4>
                <uui-alert color="positive" headline="These checks passed">
                    <p class="state-msg">Axe-core confirmed these rules are satisfied on this page. Each card below shows the element that was tested and the criteria it met. Passing these checks does not guarantee full WCAG conformance — manual testing is still recommended.</p>
                </uui-alert>
                ${this._passesExpanded ? t`
                    <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                        ${this._result.passingChecks.map((n) => this._renderPassingCheck(n))}
                    </div>
                ` : l}
            ` : l}
        `;
  }
  _renderViolation(e, s) {
    const o = (s === "violations" ? this._collapsed : this._collapsedIncomplete).has(e.id), r = this._wcagTags(e.tags), i = e.impact ?? "minor", u = C[i] ?? "#6b7280", n = S[i] ?? "rgba(0,0,0,0.06)";
    return t`
            <uui-box class="block-box block-box--${i}${o ? " block-box--collapsed" : ""}">
                <div slot="headline" class="block-headline">
                    <span class="impact-badge" style="--badge-color: ${u}; --badge-bg: ${n}">
                        ${i.charAt(0).toUpperCase() + i.slice(1)}
                    </span>
                    <span class="block-headline__text">${e.help}</span>
                    ${e.wcagLevel || r.length > 0 ? t`
                        <div class="block-headline__tags">
                            ${e.wcagLevel ? t`<span class="wcag-badge wcag-badge--${e.wcagLevel.toLowerCase().replace(" ", "-")}">${this._wcagLevelLabel(e.wcagLevel)}</span>` : l}
                            ${r.map((h) => t`<span class="tag">${h}</span>`)}
                        </div>
                    ` : l}
                </div>

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => {
      s === "violations" ? this._collapsed = this._toggleItem(e.id, this._collapsed) : this._collapsedIncomplete = this._toggleItem(e.id, this._collapsedIncomplete);
    }}>
                    <span class="btn-content">
                        ${o ? "Expand" : "Collapse"}
                        <svg class="btn-icon chevron-icon ${o ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                    </span>
                </uui-button>

                ${o ? l : t`
                    <div class="violation-body">
                        <div class="violation-desc-row">
                            <code class="rule-id">${e.id}</code>
                            <p class="violation-description">${e.description}</p>
                            <uui-button
                                look="primary"
                                compact
                                href="${e.helpUrl}"
                                target="_blank"
                                rel="noopener noreferrer">
                                <span class="btn-content">Learn more ${m}</span>
                            </uui-button>
                        </div>

                        <h5 class="nodes-heading">
                            <span>${e.nodes.length} affected element${e.nodes.length === 1 ? "" : "s"}</span>
                        </h5>
                        <div class="nodes-list">
                            ${e.nodes.map((h, v) => t`
                                <div class="node">
                                    <div class="node__header">
                                        <span class="node__index" style="background: ${u}; color: #fff;">${v + 1}</span>
                                        ${h.failureSummary ? t`<span class="node__reasons-label">WHY THIS FAILS</span>` : l}
                                    </div>
                                    <div class="node__content">
                                        ${h.failureSummary ? t`
                                            <ul class="node__reasons-list">
                                                ${h.failureSummary.split("; ").filter((_) => _.length > 0).map((_) => t`<li class="node__reasons-item" style="color: ${u};">${Y}<span>${_}</span></li>`)}
                                            </ul>
                                        ` : l}
                                        <span class="node__html-label">IMPACTED CODE</span>
                                        <pre class="node__html"><code>${h.html}</code></pre>
                                        ${this._isSpecificSelector(h.target) ? t`
                                            <div class="node__selector">
                                                <span class="node__selector-label">CSS SELECTOR</span>
                                                <p class="node__selector-hint">Copy and paste into browser DevTools (Inspect &rarr; Ctrl+F or Find by selector) to quickly locate this element on the front end.</p>
                                                <div class="node__selector-body">
                                                    <pre class="node__selector-code"><code>${h.target}</code></pre>
                                                    <uui-button
                                                        compact
                                                        look="outline"
                                                        title="Copy selector"
                                                        @click=${() => navigator.clipboard.writeText(h.target)}>
                                                        Copy
                                                    </uui-button>
                                                </div>
                                            </div>
                                        ` : l}
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                `}
            </uui-box>
        `;
  }
  _renderPassingCheck(e) {
    const s = this._collapsedPasses.has(e.id), a = this._wcagTags(e.tags);
    return t`
            <uui-box class="block-box block-box--passes${s ? " block-box--collapsed" : ""}">
                <div slot="headline" class="block-headline">
                    <span class="pass-header-label">PASSED</span>
                    <span class="block-headline__text">${e.help}</span>
                    ${a.length > 0 ? t`
                        <div class="block-headline__tags">
                            ${a.map((o) => t`<span class="tag">${o}</span>`)}
                        </div>
                    ` : l}
                </div>

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => {
      this._collapsedPasses = this._toggleItem(e.id, this._collapsedPasses);
    }}>
                    <span class="btn-content">
                        ${s ? "Expand" : "Collapse"}
                        <svg class="btn-icon chevron-icon ${s ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                    </span>
                </uui-button>

                ${s ? l : t`
                    <div class="violation-body">
                        <div class="violation-desc-row">
                            <code class="rule-id">${e.id}</code>
                            <p class="violation-description">${e.description}</p>
                            <uui-button
                                look="primary"
                                compact
                                href="${e.helpUrl}"
                                target="_blank"
                                rel="noopener noreferrer">
                                <span class="btn-content">Learn more ${m}</span>
                            </uui-button>
                        </div>
                        ${e.nodes.length > 0 ? t`
                            <h5 class="nodes-heading">
                                <span>${e.nodes.length} element${e.nodes.length === 1 ? "" : "s"} checked</span>
                            </h5>
                            <div class="nodes-list">
                                ${e.nodes.map((o, r) => t`
                                    <div class="node">
                                        <div class="node__header">
                                            <span class="node__index" style="background: #27ae60; color: #fff;">${r + 1}</span>
                                            <span class="node__reasons-label">WHY THIS PASSES</span>
                                        </div>
                                        <div class="node__content">
                                            ${o.failureSummary ? t`
                                                <ul class="node__reasons-list">
                                                    ${o.failureSummary.split("; ").filter((i) => i.length > 0).map((i) => t`<li class="node__reasons-item node__reasons-item--pass">${J}<span>${i}</span></li>`)}
                                                </ul>
                                            ` : l}
                                            <span class="node__html-label">PASSING CODE</span>
                                            <pre class="node__html"><code>${o.html}</code></pre>
                                            ${this._isSpecificSelector(o.target) ? t`
                                                <div class="node__selector">
                                                    <span class="node__selector-label">CSS SELECTOR</span>
                                                    <div class="node__selector-body">
                                                        <pre class="node__selector-code"><code>${o.target}</code></pre>
                                                        <uui-button
                                                            compact
                                                            look="outline"
                                                            title="Copy selector"
                                                            @click=${() => navigator.clipboard.writeText(o.target)}>
                                                            Copy
                                                        </uui-button>
                                                    </div>
                                                </div>
                                            ` : l}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        ` : l}
                    </div>
                `}
            </uui-box>
        `;
  }
};
c.styles = H`
        :host {
            display: block;
            padding: var(--uui-size-layout-1);
        }

        /* ── Page header ─────────────────────────────────────────── */

        .page-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--uui-size-space-4);
            margin-bottom: var(--uui-size-layout-1);
            flex-wrap: wrap;
        }

        .page-header-main {
            flex: 1;
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-5);
        }


        .page-title {
            margin: 0 0 var(--uui-size-space-2);
            font-size: var(--uui-type-large-size, 18px);
            font-weight: 700;
            color: var(--uui-color-text, #1a1a1a);
        }

        .page-description {
            margin: 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
            line-height: 1.5;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            flex-shrink: 0;
            margin-top: var(--uui-size-space-3);
        }

        .btn-content {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .btn-icon {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        /* ── Loading ─────────────────────────────────────────────── */

        .loader {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: var(--uui-size-space-3);
            padding: var(--uui-size-layout-3);
        }
        .loader-text {
            font-size: 13px;
            color: var(--uui-color-text-alt);
        }
        .loader-alert-wrap {
            padding: var(--uui-size-layout-1);
        }

        .thinking-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            min-height: 24px;
        }

        .thinking-icon {
            font-size: 16px;
            line-height: 1;
            animation: thinking-icon-pop 0.3s ease-out;
        }

        .thinking-message {
            font-size: 13px;
            color: var(--uui-color-text-alt, #6b7280);
            animation: thinking-fade 0.4s ease-out;
        }

        @keyframes thinking-icon-pop {
            from { transform: scale(0.6); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
        }

        @keyframes thinking-fade {
            from { opacity: 0; transform: translateX(-4px); }
            to   { opacity: 1; transform: translateX(0); }
        }

        .scan-progress-track {
            width: 100%;
            height: 4px;
            background: var(--uui-color-border);
            border-radius: 2px;
            overflow: hidden;
        }
        .scan-progress-fill {
            height: 100%;
            width: 40%;
            background: var(--uui-color-positive, #27ae60);
            border-radius: 2px;
            animation: scan-progress-anim 1.8s ease-in-out infinite;
        }
        @keyframes scan-progress-anim {
            0%   { transform: translateX(-100%); width: 40%; }
            50%  { width: 60%; }
            100% { transform: translateX(350%); width: 40%; }
        }

        /* ── State messages ──────────────────────────────────────── */

        .state-msg {
            margin: 0 0 4px;
            font-size: var(--uui-type-default-size, 13px);
        }

        .state-hint {
            margin: 6px 0 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
        }

        .fetch-url-box {
            margin: 10px 0 0;
            padding: 8px 10px;
            background: rgba(0, 0, 0, 0.06);
            border-radius: var(--uui-border-radius, 3px);
            border-left: 3px solid rgba(0, 0, 0, 0.18);
        }

        .fetch-url-label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 4px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .fetch-url-code {
            font-family: var(--uui-font-monospace, monospace);
            font-size: 11px;
            word-break: break-all;
            color: var(--uui-color-text, #1a1a1a);
        }

        /* ── Top row: grade ring + stat cards ───────────────────── */

        .stat-card__value-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .delta-badge {
            font-size: 11px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 3px;
            line-height: 1.3;
            flex-shrink: 0;
        }

        .delta-badge--up   { background: rgba(39,174,96,0.14);  color: #1a7a4a; }
        .delta-badge--down { background: rgba(192,57,43,0.14);  color: #c0392b; }

        .grade-ring-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--uui-size-space-2);
            flex-shrink: 0;
        }

        .grade-delta {
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 99px;
            white-space: nowrap;
        }

        .grade-delta--up   { background: rgba(39,174,96,0.14);  color: #1a7a4a; }
        .grade-delta--down { background: rgba(192,57,43,0.14);  color: #c0392b; }

        .top-row {
            display: flex;
            align-items: stretch;
            gap: var(--uui-size-space-5);
            margin-bottom: var(--uui-size-layout-1);
            flex-wrap: wrap;
        }

        /* Grade ring */

        .grade-ring {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            border: 5px solid var(--ring-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: color-mix(in srgb, var(--ring-color) 8%, transparent);
            gap: 1px;
            transition: border-color 0.5s ease, background 0.5s ease;
        }

        .grade-ring__letter {
            font-size: 32px;
            font-weight: 800;
            line-height: 1;
            color: var(--text-color);
            transition: color 0.5s ease;
        }

        .grade-ring__score {
            font-size: 10px;
            font-weight: 700;
            color: var(--text-color);
            opacity: 0.85;
            line-height: 1;
            transition: color 0.5s ease;
        }

        /* Stat cards */

        .stats-row {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--uui-size-space-3);
            min-width: 0;
        }

        .stat-card {
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--uui-size-space-3);
            padding: var(--uui-size-space-4) var(--uui-size-space-4) var(--uui-size-space-3);
            border-radius: var(--uui-border-radius, 3px);
            background: var(--uui-color-surface, #fff);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
        }

        .stat-card--violations::before { background: #c0392b; }
        .stat-card--passes::before     { background: #27ae60; }
        .stat-card--review::before     { background: #b7770d; }
        .stat-card--rules::before      { background: #2471a3; }

        .stat-card__icon {
            width: 36px;
            height: 36px;
            flex-shrink: 0;
        }

        .stat-card__icon svg {
            width: 100%;
            height: 100%;
        }

        .stat-card--violations .stat-card__icon { color: #c0392b; }
        .stat-card--passes .stat-card__icon     { color: #27ae60; }
        .stat-card--review .stat-card__icon     { color: #b7770d; }
        .stat-card--rules .stat-card__icon      { color: #2471a3; }

        .stat-card__info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .stat-card__value {
            font-size: 26px;
            font-weight: 800;
            line-height: 1;
            color: var(--uui-color-text, #1a1a1a);
        }

        .stat-card__label {
            font-size: 13px;
            font-weight: 600;
            color: var(--uui-color-text, #1a1a1a);
            white-space: nowrap;
        }

        /* ── Filter + collapse row ───────────────────────────────── */

        .filter-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--uui-size-space-3);
            margin-bottom: var(--uui-size-layout-1);
            flex-wrap: wrap;
        }

        .summary-filters {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            flex-wrap: wrap;
        }

        .impact-pill {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 700;
            border: 2px solid var(--pill-color);
            background: #fff;
            color: var(--pill-color);
            cursor: pointer;
            transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
            font-family: inherit;
        }

        .impact-pill:hover {
            background: color-mix(in srgb, var(--pill-color) 15%, #fff);
        }

        .impact-pill--active {
            background: var(--pill-color);
            color: #fff;
        }

        .impact-pill--dimmed {
            opacity: 0.4;
        }

        /* ── Chevron icon ────────────────────────────────────────── */

        .chevron-icon {
            transition: transform 0.2s ease;
        }

        .chevron-icon--up {
            transform: rotate(180deg);
        }

        /* ── Filter hint ─────────────────────────────────────────── */

        .filter-hint {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            margin: 0 0 var(--uui-size-layout-1);
            padding: var(--uui-size-space-3) var(--uui-size-space-4);
            border-radius: var(--uui-border-radius, 3px);
            background: var(--uui-color-info-subtle, #eff6ff);
            border: 1px solid var(--uui-color-info-emphasis, #93c5fd);
            font-size: var(--uui-type-default-size, 14px);
            color: var(--uui-color-text, #1f2937);
        }

        /* ── Exec row: quick wins + audience ─────────────────────── */

        .exec-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--uui-size-space-4);
            margin-bottom: var(--uui-size-layout-1);
        }

        @media (max-width: 640px) {
            .stats-row { grid-template-columns: repeat(2, 1fr); }
        }

        .exec-card {
            background: var(--uui-color-surface, #fff);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            border-radius: var(--uui-border-radius, 3px);
            padding: var(--uui-size-space-4);
        }

        .exec-card__heading {
            margin: 0 0 var(--uui-size-space-5);
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--uui-color-text, #1a1a1a);
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-5);
        }

        .exec-card__heading svg {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .exec-card__subtitle {
            margin: 0 0 var(--uui-size-space-5);
            font-size: 13px;
            color: var(--uui-color-text, #1a1a1a);
        }

        .quick-wins-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-5);
        }

        .quick-win {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            font-size: 13px;
            color: var(--uui-color-text, #1a1a1a);
        }

        .quick-win__text {
            flex: 1;
            min-width: 0;
            display: flex;
            align-items: baseline;
            gap: var(--uui-size-space-2);
        }

        .quick-win__title {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .quick-win__nodes {
            font-size: 11px;
            color: var(--uui-color-text-alt, #6b7280);
            white-space: nowrap;
            flex-shrink: 0;
        }

        .effort-badge {
            flex-shrink: 0;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 2px 6px;
            border-radius: 3px;
            min-width: 56px;
            text-align: center;
        }

        .effort-badge--low    { background: rgba(36,113,163,0.12); color: #2471a3; }
        .effort-badge--medium { background: rgba(183,119,13,0.12); color: #b7770d; }
        .effort-badge--high   { background: rgba(192,57,43,0.12);  color: #c0392b; }

        .audience-chips {
            display: flex;
            flex-wrap: wrap;
            gap: var(--uui-size-space-2);
        }

        .audience-chip {
            padding: 4px 12px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 600;
            background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 10%, transparent);
            color: var(--uui-color-interactive, #1e3a8a);
            border: 1px solid color-mix(in srgb, var(--uui-color-interactive, #3544b1) 25%, transparent);
        }

        /* ── Section headings ────────────────────────────────────── */

        .section-heading {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            font-size: 15px;
            font-weight: 700;
            text-transform: none;
            letter-spacing: normal;
            color: var(--uui-color-text, #1a1a1a);
            border-bottom: 2px solid var(--uui-color-border, #d8d7d9);
            padding-bottom: var(--uui-size-space-3);
            margin: 0 0 var(--uui-size-space-4);
        }

        .section-heading--violations {
            color: #c0392b;
            border-bottom-color: rgba(192, 57, 43, 0.3);
        }

        .section-heading--review {
            color: #b7770d;
            border-bottom-color: rgba(183, 119, 13, 0.3);
        }

        .section-heading__icon {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
        }

        .section-heading-count {
            font-size: 13px;
            font-weight: 400;
            color: var(--uui-color-text-alt, #6b7280);
            margin-left: 2px;
        }

        /* ── Block boxes (violation cards) ───────────────────────── */

        .block-box {
            margin-bottom: var(--uui-size-space-3);
        }

        .block-box--critical::part(header) {
            background-color: rgba(192, 57, 43, 0.10);
        }

        .block-box--serious::part(header) {
            background-color: rgba(211, 84, 0, 0.10);
        }

        .block-box--moderate::part(header) {
            background-color: rgba(183, 119, 13, 0.10);
        }

        .block-box--minor::part(header) {
            background-color: rgba(36, 113, 163, 0.08);
        }

        .block-box--collapsed {
            --uui-box-default-padding: 0;
        }

        .block-headline {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            flex-wrap: wrap;
        }

        .block-headline__text {
            flex: 1;
            min-width: 0;
        }

        .block-headline__tags {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-1);
            flex-wrap: wrap;
        }

        /* ── Impact badge ────────────────────────────────────────── */

        .impact-badge {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 2px 7px;
            border-radius: var(--uui-border-radius, 3px);
            background: var(--badge-bg);
            color: var(--badge-color);
            flex-shrink: 0;
        }

        /* ── Violation body ──────────────────────────────────────── */

        .violations-list {
            display: flex;
            flex-direction: column;
        }

        .violation-body {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-4);
        }

        .violation-body > *:last-child {
            margin-bottom: 0;
        }

        .violation-desc-row {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
        }

        .violation-desc-row .violation-description {
            flex: 1;
            min-width: 0;
        }

        .violation-description {
            margin: 0;
            font-size: var(--uui-type-default-size, 13px);
            color: var(--uui-color-text-alt, #6b7280);
            line-height: 1.5;
        }

        .rule-id {
            font-family: var(--uui-font-monospace, monospace);
            font-size: 11px;
            padding: 1px 6px;
            border-radius: 3px;
            background: var(--uui-color-surface-alt, #f3f3f5);
            border: 1px solid rgba(0, 0, 0, 0.12);
            color: var(--uui-color-text-alt, #6b7280);
        }

        .tag {
            padding: 2px 8px;
            border-radius: 99px;
            font-size: 11px;
            font-weight: 600;
            background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 10%, transparent);
            color: var(--uui-color-interactive, #1e3a8a);
            border: 1px solid color-mix(in srgb, var(--uui-color-interactive, #3544b1) 20%, transparent);
        }

        /* ── Nodes list ──────────────────────────────────────────── */

        .nodes-heading {
            margin: 0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--uui-color-text-alt, #6b7280);
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
        }

        .nodes-list {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-5);
            padding: var(--uui-size-space-3) 0;
        }

        .node {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-5);
            padding: var(--uui-size-space-5);
            background: var(--uui-color-surface, #fff);
            border-radius: var(--uui-border-radius, 3px);
            border: 1px solid var(--uui-color-border, #d8d7d9);
        }

        .node__header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            width: 100%;
        }

        .node__index {
            flex-shrink: 0;
            min-width: 26px;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: var(--uui-color-border, #d8d7d9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .node__content {
            width: 100%;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-5);
        }

        .node__html {
            display: block;
            margin: 0;
            font-family: var(--uui-font-monospace, monospace);
            font-size: 12px;
            white-space: pre-wrap;
            word-break: break-all;
            background: var(--uui-color-surface-alt, #f3f3f5);
            padding: var(--uui-size-space-3);
            border-radius: var(--uui-border-radius, 3px);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            color: var(--uui-color-text, #1a1a1a);
        }

        .node__html code {
            font-family: inherit;
            font-size: inherit;
        }

        .node__html-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--uui-color-text, #1a1a1a);
        }

        .node__reasons-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--uui-color-text, #1a1a1a);
            margin-top: 2px;
        }

        .node__reasons-list {
            margin: 0;
            padding: 0;
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .node__reasons-item {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            font-size: 13px;
            line-height: 1.4;
        }

        .reason-icon {
            flex-shrink: 0;
            width: 15px;
            height: 15px;
            margin-top: 1px;
        }

        .reason-icon--pass {
            color: #27ae60;
        }

        .node__reasons-item--pass {
            color: #1a6b3c;
        }

        .node__selector {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-4);
            margin: 15px 0 0 0;
        }

        .node__selector-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--uui-color-text, #1a1a1a);
        }

        .node__selector-hint {
            margin: 0;
            font-size: 13px;
            color: var(--uui-color-text, #1a1a1a);
            line-height: 1.4;
        }

        .node__selector-body {
            display: flex;
            align-items: flex-start;
            gap: var(--uui-size-space-2);
        }

        .node__selector-code {
            flex: 1;
            margin: 0;
            font-family: var(--uui-font-monospace, monospace);
            font-size: 12px;
            white-space: pre-wrap;
            word-break: break-all;
            background: var(--uui-color-surface-alt, #f3f3f5);
            padding: var(--uui-size-space-2) var(--uui-size-space-3);
            border-radius: var(--uui-border-radius, 3px);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            color: var(--uui-color-text, #1a1a1a);
        }

        .node__selector-code code {
            font-family: inherit;
            font-size: inherit;
        }

        /* ── Passing checks ──────────────────────────────────────── */

        .section-heading--passes {
            color: #27ae60;
            border-bottom-color: rgba(39, 174, 96, 0.3);
        }

        .section-heading--violations uui-button,
        .section-heading--review uui-button,
        .section-heading--passes uui-button,
        .section-heading--history uui-button {
            margin-left: auto;
            flex-shrink: 0;
        }

        .passes-collapse-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-left: auto;
            padding: 3px 10px;
            background: none;
            border: 1px solid rgba(39, 174, 96, 0.4);
            border-radius: var(--uui-border-radius, 3px);
            color: #27ae60;
            font-size: 12px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: background 0.15s ease;
        }

        .passes-collapse-btn:hover {
            background: rgba(39, 174, 96, 0.08);
        }

        .block-box--passes::part(header) {
            background-color: rgba(39, 174, 96, 0.08);
        }

        .pass-header-label {
            display: inline-flex;
            align-items: center;
            font-size: 11px;
            font-weight: 600;
            color: #27ae60;
            background: rgba(39, 174, 96, 0.12);
            border: 1px solid rgba(39, 174, 96, 0.3);
            border-radius: 4px;
            padding: 2px 7px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .pass-node-count {
            font-size: 12px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        /* ── WCAG level badge — matches .tag pill style ──────────── */

        .wcag-badge {
            padding: 2px 8px;
            border-radius: 99px;
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
            background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 10%, transparent);
            color: var(--uui-color-interactive, #1e3a8a);
            border: 1px solid color-mix(in srgb, var(--uui-color-interactive, #3544b1) 20%, transparent);
        }

        /* ── History load bar ────────────────────────────────────── */

        .history-load-bar {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            padding: var(--uui-size-space-3) var(--uui-size-space-4);
            border-radius: var(--uui-border-radius, 3px);
            background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 6%, transparent);
            border: 1px solid color-mix(in srgb, var(--uui-color-interactive, #3544b1) 25%, transparent);
            font-size: 13px;
            color: var(--uui-color-text, #1a1a1a);
        }

        /* ── Historical scan context card ────────────────────────── */

        .historical-card {
            margin-bottom: var(--uui-size-layout-1);
        }

        .historical-card__header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
        }

        .historical-card__icon {
            width: 22px;
            height: 22px;
            flex-shrink: 0;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .historical-card__content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .historical-card__label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .historical-card__date {
            font-size: 14px;
            font-weight: 700;
            color: var(--uui-color-text, #1a1a1a);
        }

        .historical-card__meta {
            font-size: 12px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        /* ── Scan history ────────────────────────────────────────── */

        .history-section {
            margin-bottom: var(--uui-size-layout-1);
        }

        .history-row--latest td {
            font-weight: 600;
        }

        .history-row--active td {
            background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 6%, transparent);
        }

        .history-load-btn {
            min-width: 4.5rem;
        }
        .history-action-disabled {
            display: inline-block;
            opacity: 0.35;
            pointer-events: none;
            cursor: not-allowed;
        }

        .history-actions {
            display: flex;
            gap: var(--uui-size-space-2);
            white-space: nowrap;
        }

        .history-footer {
            padding: var(--uui-size-space-3) 0 0;
            display: flex;
            justify-content: flex-start;
        }

        .history-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .history-table th,
        .history-table td {
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid var(--uui-color-border, #d8d7d9);
        }

        .history-table thead th {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--uui-color-text-alt, #6b7280);
            background: var(--uui-color-surface, #fff);
        }
        .history-table thead th.th--violations { color: #8b1a1a; }
        .history-table thead th.th--critical   { color: #c0392b; }
        .history-table thead th.th--serious    { color: #d35400; }
        .history-table thead th.th--moderate   { color: #b7770d; }
        .history-table thead th.th--minor      { color: #2471a3; }
        .history-table thead th.th--passes     { color: #1a7a4a; }

        .history-table tbody tr:last-child td {
            border-bottom: none;
        }

        .history-table tbody tr:first-child td {
            font-weight: 600;
        }

        .history-grade {
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 3px;
        }

        .history-grade--a { background: rgba(39,174,96,0.15);  color: #1a7a4a; }
        .history-grade--b { background: rgba(46,204,113,0.15); color: #1a6b2a; }
        .history-grade--c { background: rgba(243,156,18,0.15); color: #b7770d; }
        .history-grade--d { background: rgba(230,126,34,0.15); color: #d35400; }
        .history-grade--f { background: rgba(231,76,60,0.15);  color: #c0392b; }

        .grade-circle {
            display: inline-flex; align-items: center; justify-content: center;
            width: 28px; height: 28px; border-radius: 50%;
            border: 2px solid currentColor;
            background: color-mix(in srgb, currentColor 15%, transparent);
            font-weight: 800; font-size: 12px; flex-shrink: 0;
        }

        .count-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 3px; }
        .count-badge--violations { background: rgba(139,26,26,0.12);  color: #8b1a1a; }
        .count-badge--critical   { background: rgba(192,57,43,0.12);  color: #c0392b; }
        .count-badge--serious    { background: rgba(211,84,0,0.12);   color: #d35400; }
        .count-badge--moderate   { background: rgba(183,119,13,0.12); color: #b7770d; }
        .count-badge--minor      { background: rgba(36,113,163,0.12); color: #2471a3; }
        .count-badge--passes     { background: rgba(39,174,96,0.12);  color: #1a7a4a; }
        .count-zero { color: var(--uui-color-text-alt, #9ca3af); font-size: 13px; }
    `;
d([
  p()
], c.prototype, "_loading", 2);
d([
  p()
], c.prototype, "_scanInProgress", 2);
d([
  p()
], c.prototype, "_thinkingIdx", 2);
d([
  p()
], c.prototype, "_result", 2);
d([
  p()
], c.prototype, "_error", 2);
d([
  p()
], c.prototype, "_collapsed", 2);
d([
  p()
], c.prototype, "_collapsedIncomplete", 2);
d([
  p()
], c.prototype, "_collapsedPasses", 2);
d([
  p()
], c.prototype, "_activeImpact", 2);
d([
  p()
], c.prototype, "_allCollapsed", 2);
d([
  p()
], c.prototype, "_violationsExpanded", 2);
d([
  p()
], c.prototype, "_reviewExpanded", 2);
d([
  p()
], c.prototype, "_passesExpanded", 2);
d([
  p()
], c.prototype, "_history", 2);
d([
  p()
], c.prototype, "_historyExpanded", 2);
d([
  p()
], c.prototype, "_historicalDate", 2);
d([
  p()
], c.prototype, "_historyLoading", 2);
d([
  p()
], c.prototype, "_historicalIndex", 2);
d([
  p()
], c.prototype, "_displayScore", 2);
d([
  p()
], c.prototype, "_displayGrade", 2);
d([
  p()
], c.prototype, "_displayColor", 2);
d([
  p()
], c.prototype, "_displayViolations", 2);
d([
  p()
], c.prototype, "_displayPasses", 2);
d([
  p()
], c.prototype, "_displayIncomplete", 2);
d([
  p()
], c.prototype, "_displayRules", 2);
c = d([
  T("uaccessible-workspace-view")
], c);
const oe = c;
export {
  oe as default,
  c as uAccessibleWorkspaceViewElement
};
//# sourceMappingURL=workspace-view.element-BeUFoy0O.js.map
