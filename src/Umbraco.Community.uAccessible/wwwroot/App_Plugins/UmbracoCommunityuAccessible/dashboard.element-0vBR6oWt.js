import { LitElement as f, nothing as d, html as s, css as w, state as h, customElement as k } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as m } from "@umbraco-cms/backoffice/element-api";
import { UMB_AUTH_CONTEXT as y } from "@umbraco-cms/backoffice/auth";
import { UMB_MODAL_MANAGER_CONTEXT as $ } from "@umbraco-cms/backoffice/modal";
import { UMB_DOCUMENT_PICKER_MODAL as M } from "@umbraco-cms/backoffice/document";
var S = Object.defineProperty, C = Object.getOwnPropertyDescriptor, u = (t, a, o, r) => {
  for (var l = r > 1 ? void 0 : r ? C(a, o) : a, i = t.length - 1, e; i >= 0; i--)
    (e = t[i]) && (l = (r ? e(a, o, l) : e(l)) || l);
  return r && l && S(a, o, l), l;
};
const v = "/umbraco/umbracommunityuaccessible/api/v1";
function x(t) {
  switch (t) {
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
function _(t) {
  return t >= 95 ? "A" : t >= 80 ? "B" : t >= 65 ? "C" : t >= 50 ? "D" : "F";
}
const z = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <path d="M9 13h6" /><path d="M9 17h4" />
</svg>`, H = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`, E = s`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <path d="M12 5v2" /><path d="M12 10v1" /><path d="M12 14v1" /><path d="M12 18v1" />
    <path d="M7 3v2" /><path d="M17 3v2" />
    <path d="M15 10.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0" />
    <path d="M6 9h1.5a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1.5" />
</svg>`, A = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
</svg>`, P = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
</svg>`, j = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 8l0 4l2 2" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
</svg>`;
let c = class extends m(f) {
  constructor() {
    super(...arguments), this._selectedKey = null, this._selectedName = null, this._scanning = !1, this._scanInProgress = !1, this._result = null, this._error = null, this._sortBy = "tree", this._sortAsc = !0, this._resultsExpanded = !0, this._siteHistory = [], this._historyExpanded = !1, this._historyLoading = null, this._historicalIndex = null, this._historicalDate = null, this._tokenProvider = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(y, (t) => {
      this._tokenProvider = (t == null ? void 0 : t.getOpenApiConfiguration().token) ?? null;
    }), this.consumeContext($, (t) => {
      this._modalManager = t;
    });
  }
  async _token() {
    const t = this._tokenProvider ? await this._tokenProvider() : void 0;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
  async _pickContent() {
    var r, l, i;
    if (!this._modalManager) return;
    const a = await this._modalManager.open(this, M, {
      data: { multiple: !1, pickableFilter: () => !0 }
    }).onSubmit().catch(() => {
    });
    if (!((r = a == null ? void 0 : a.selection) != null && r.length)) return;
    const o = a.selection[0];
    if (o) {
      this._selectedKey = o, this._selectedName = o, this._result = null, this._error = null, this._siteHistory = [], this._historicalDate = null, this._historicalIndex = null;
      try {
        const e = await this._token(), g = await fetch(`/umbraco/management/api/v1/document/${o}`, {
          headers: { Accept: "application/json", ...e }
        });
        if (g.ok) {
          const p = await g.json();
          this._selectedName = ((i = (l = p == null ? void 0 : p.variants) == null ? void 0 : l[0]) == null ? void 0 : i.name) ?? (p == null ? void 0 : p.name) ?? o;
        }
      } catch {
      }
      await this._fetchSiteHistory();
    }
  }
  async _runScan() {
    if (this._selectedKey) {
      this._scanning = !0, this._scanInProgress = !1, this._result = null, this._error = null, this._historicalDate = null, this._historicalIndex = null;
      try {
        const t = await this._token(), a = await fetch(`${v}/audit/tree/${this._selectedKey}`, {
          headers: { Accept: "application/json", ...t }
        });
        if (a.status === 409) {
          this._scanInProgress = !0;
          return;
        }
        if (!a.ok) throw new Error(`${a.status} ${a.statusText}`);
        this._result = await a.json(), this._historyExpanded = !1, await this._fetchSiteHistory();
      } catch (t) {
        this._error = t instanceof Error ? t.message : "An unexpected error occurred.";
      } finally {
        this._scanning = !1;
      }
    }
  }
  async _fetchSiteHistory() {
    if (this._selectedKey)
      try {
        const t = await this._token(), a = await fetch(`${v}/audit/site-history/${this._selectedKey}`, {
          headers: { Accept: "application/json", ...t }
        });
        a.ok && (this._siteHistory = await a.json());
      } catch {
      }
  }
  async _loadHistoryEntry(t, a) {
    if (this._selectedKey) {
      this._historyLoading = t;
      try {
        const o = await this._token(), r = await fetch(`${v}/audit/site-history/${this._selectedKey}/${t}`, {
          headers: { Accept: "application/json", ...o }
        });
        if (r.status === 404) {
          this._error = "This history entry has no stored report. It was recorded before full result storage was added. Run a new scan to capture a complete report.";
          return;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        this._result = await r.json(), this._historicalDate = a, this._historicalIndex = t, this._historyExpanded = !1;
      } catch (o) {
        this._error = o instanceof Error ? o.message : "Could not load historical scan.";
      } finally {
        this._historyLoading = null;
      }
    }
  }
  async _deleteHistoryEntry(t) {
    if (this._selectedKey)
      try {
        const a = await this._token();
        await fetch(`${v}/audit/site-history/${this._selectedKey}/${t}`, {
          method: "DELETE",
          headers: a
        }), await this._fetchSiteHistory(), this._historicalIndex === t && (this._result = null, this._historicalDate = null, this._historicalIndex = null);
      } catch {
      }
  }
  async _clearHistory() {
    if (this._selectedKey)
      try {
        const t = await this._token();
        await fetch(`${v}/audit/site-history/${this._selectedKey}`, {
          method: "DELETE",
          headers: t
        }), this._siteHistory = [], this._result = null, this._historicalDate = null, this._historicalIndex = null;
      } catch {
      }
  }
  _sortedPages() {
    return this._result ? this._sortBy === "tree" ? this._result.pages : [...this._result.pages].sort((t, a) => {
      let o = 0;
      return this._sortBy === "name" && (o = (t.name ?? "").localeCompare(a.name ?? "")), this._sortBy === "score" && (o = t.score - a.score), this._sortBy === "violations" && (o = t.violationCount - a.violationCount), this._sortAsc ? o : -o;
    }) : [];
  }
  _setSort(t) {
    this._sortBy === t ? this._sortAsc = !this._sortAsc : (this._sortBy = t, this._sortAsc = t === "name");
  }
  /** Delta vs the scan before the current live result (index 1 after a fresh scan). */
  _delta() {
    if (!this._result || this._historicalDate) return null;
    const t = this._siteHistory[1];
    return t ? {
      score: Math.round(this._result.averageScore) - Math.round(t.averageScore),
      violations: this._result.totalViolations - t.totalViolations
    } : null;
  }
  _exportCsv() {
    if (!this._result) return;
    const t = [["Page", "URL", "Grade", "Score", "Violations", "Critical", "Serious", "Status"]];
    for (const e of this._result.pages)
      t.push([
        `"${(e.name ?? "").replace(/"/g, '""')}"`,
        `"${(e.url ?? "").replace(/"/g, '""')}"`,
        e.skipped ? "" : e.grade,
        e.skipped ? "" : String(e.score),
        e.skipped ? "" : String(e.violationCount),
        e.skipped ? "" : String(e.criticalCount),
        e.skipped ? "" : String(e.seriousCount),
        e.skipped ? `"Skipped: ${(e.skipReason ?? "").replace(/"/g, '""')}"` : "Scanned"
      ]);
    const a = t.map((e) => e.join(",")).join(`
`), o = new Blob([a], { type: "text/csv;charset=utf-8;" }), r = URL.createObjectURL(o), l = document.createElement("a");
    l.href = r;
    const i = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
    l.download = `uAccessible-site-audit-${i}.csv`, l.click(), URL.revokeObjectURL(r);
  }
  async _exportHistoryCsv(t) {
    if (this._selectedKey)
      try {
        const a = await this._token(), o = await fetch(`${v}/audit/site-history/${this._selectedKey}/${t}`, {
          headers: { Accept: "application/json", ...a }
        });
        if (!o.ok) return;
        const r = await o.json(), l = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", "_").replace(":", "-"), i = [["Page", "URL", "Grade", "Score", "Violations", "Critical", "Serious", "Passes", "Status"]];
        for (const n of r.pages)
          i.push([
            `"${(n.name ?? "").replace(/"/g, '""')}"`,
            `"${(n.url ?? "").replace(/"/g, '""')}"`,
            n.skipped ? "" : n.grade,
            n.skipped ? "" : String(n.score),
            n.skipped ? "" : String(n.violationCount),
            n.skipped ? "" : String(n.criticalCount),
            n.skipped ? "" : String(n.seriousCount),
            n.skipped ? "" : String(n.passingCount),
            n.skipped ? `"Skipped: ${(n.skipReason ?? "").replace(/"/g, '""')}"` : "Scanned"
          ]);
        const e = i.map((n) => n.join(",")).join(`
`), g = new Blob([e], { type: "text/csv;charset=utf-8;" }), p = URL.createObjectURL(g), b = document.createElement("a");
        b.href = p, b.download = `uAccessible-site-audit-${l}.csv`, b.click(), URL.revokeObjectURL(p);
      } catch {
      }
  }
  updated(t) {
    var a;
    if (t.has("_result") && this._result && !this._historicalDate) {
      const o = (a = this.shadowRoot) == null ? void 0 : a.querySelectorAll(".count-up");
      if (!o) return;
      o.forEach((r) => {
        const l = parseInt(r.dataset.target ?? "0", 10);
        if (isNaN(l) || l === 0) return;
        const i = 600, e = performance.now(), g = (p) => {
          const b = Math.min((p - e) / i, 1), n = 1 - Math.pow(1 - b, 3);
          r.textContent = String(Math.round(l * n)), b < 1 ? requestAnimationFrame(g) : r.textContent = String(l);
        };
        requestAnimationFrame(g);
      });
    }
  }
  render() {
    return s`
            <div class="layout">
                <!-- ── Header ── -->
                <div class="dash-header">
                    <img class="dash-logo"
                        src="/App_Plugins/UmbracoCommunityuAccessible/images/uAccessible_logo.png"
                        alt="uAccessible" />
                    <div class="dash-header-text">
                        <h2>uAccessible: Site Accessibility Auditor</h2>
                        <p>Pick a content node and scan it along with all of its descendants. Each page is audited using axe-core against WCAG 2.0, 2.1 &amp; 2.2 (Levels A &amp; AA).</p>
                    </div>
                </div>

                <!-- ── Picker + scan row ── -->
                <div class="picker-row">
                    <div class="picker-field">
                        ${this._selectedKey ? s`
                            <div class="selected-node">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M9 12l2 2l4 -4" />
                                    <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z" />
                                </svg>
                                <span class="selected-node__name">${this._selectedName ?? this._selectedKey}</span>
                                <button class="selected-node__clear"
                                    @click=${() => {
      this._selectedKey = null, this._selectedName = null, this._result = null, this._siteHistory = [], this._historicalDate = null, this._historicalIndex = null;
    }}
                                    title="Clear selection">×</button>
                            </div>
                        ` : s`<span class="picker-placeholder">No content node selected</span>`}
                    </div>
                    <uui-button look="outline" @click=${this._pickContent} ?disabled=${this._scanning}>
                        Pick content node
                    </uui-button>
                    <uui-button look="primary" color="positive"
                        @click=${this._runScan}
                        ?disabled=${!this._selectedKey || this._scanning}>
                        ${this._scanning ? s`<uui-loader-circle></uui-loader-circle>&nbsp;Scanning…` : "Scan subtree"}
                    </uui-button>
                </div>

                ${this._scanning ? s`
                    <uui-alert>
                        <p>Scanning all pages in sequence — this may take a while for large trees. Each page runs a full axe-core audit in a headless browser.</p>
                        <div class="scan-progress-track" style="margin-top: 8px;"><div class="scan-progress-fill"></div></div>
                    </uui-alert>
                ` : d}

                ${this._scanInProgress ? s`
                    <uui-alert color="warning" headline="Scan already in progress">
                        Another editor is currently running a site-wide audit on this content tree. The result will appear in <strong>Scan history</strong> shortly — no need to scan again.
                    </uui-alert>
                ` : d}

                ${this._error ? s`<uui-alert color="danger">${this._error}</uui-alert>` : d}

                <!-- ── Historical context card ── -->
                ${this._historicalDate ? s`
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
                                ${this._historicalIndex !== null ? s`
                                    <span class="historical-card__meta">Entry ${this._historicalIndex + 1} of ${this._siteHistory.length} — not the latest result</span>
                                ` : d}
                            </div>
                            <uui-button look="primary" color="positive" compact @click=${this._runScan} ?disabled=${this._scanning}>
                                Run fresh scan
                            </uui-button>
                        </div>
                    </div>
                ` : d}

                <!-- ── History card (shown whenever history exists) ── -->
                ${this._renderSiteHistory()}

                <!-- ── No result yet prompt ── -->
                ${!this._result && !this._scanning && !this._error && this._selectedKey ? s`
                    <uui-alert>
                        <p>
                            Click <strong>Scan subtree</strong> to audit all pages under this node.
                            ${this._siteHistory.length > 0 ? s` Or <strong>load a past scan</strong> from history above.` : d}
                        </p>
                    </uui-alert>
                ` : d}

                ${!this._selectedKey && !this._scanning ? s`
                    <uui-alert>
                        <p>Pick a content node above to start a site-wide accessibility audit.</p>
                    </uui-alert>
                ` : d}

                ${this._result ? this._renderResults() : d}
            </div>
        `;
  }
  _renderSiteHistory() {
    return !this._selectedKey || this._siteHistory.length === 0 ? d : s`
            <div class="history-section">
                <h4 class="section-heading section-heading--history">
                    ${j}
                    Scan history
                    <span class="section-heading-count">
                        (<strong>${this._siteHistory.length}</strong>
                        scan${this._siteHistory.length !== 1 ? "s" : ""})
                    </span>
                    <uui-button look="outline" compact class="history-toggle-btn"
                        @click=${() => {
      this._historyExpanded = !this._historyExpanded;
    }}>
                        <span class="btn-content">
                            ${this._historyExpanded ? "Collapse" : "Show"}
                            <svg class="btn-icon chevron-icon ${this._historyExpanded ? "chevron-icon--up" : ""}"
                                xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                </h4>
                ${this._historyExpanded ? s`
                    <div class="exec-card history-table-card">
                        <p class="exec-card__subtitle">Previous site-wide audits — shared across all editors, most recent first. Kept for up to 1 year (max 20 per root node). Click <strong>Load</strong> to view a past report.</p>
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Date of scan</th>
                                    <th>Pages</th>
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
                                ${this._siteHistory.map((t) => s`
                                    <tr class="${t.index === 0 ? "history-row--latest" : ""} ${this._historicalIndex === t.index ? "history-row--active" : ""}">
                                        <td>${new Date(t.scannedAt).toLocaleString()}</td>
                                        <td>${t.scannedPages}/${t.totalPages}</td>
                                        <td><span class="grade-circle" style="color: ${x(_(t.averageScore))};">${_(t.averageScore)}</span></td>
                                        <td><span class="score-val">${Math.round(t.averageScore)}/100</span></td>
                                        <td><span class="count-badge count-badge--violations">${t.totalViolations}</span></td>
                                        <td><span class="count-badge count-badge--critical">${t.totalCritical ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--serious">${t.totalSerious ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--moderate">${t.totalModerate ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--minor">${t.totalMinor ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--passes">${t.totalPasses ?? 0}</span></td>
                                        <td class="history-actions">
                                            ${this._historyLoading === t.index ? s`<uui-button look="${this._historicalIndex === t.index ? "primary" : "outline"}" compact class="history-load-btn" title="Loading…">
                                                        <uui-loader-circle></uui-loader-circle>
                                                      </uui-button>` : this._scanning || this._historyLoading !== null ? s`<span class="history-action-disabled" title="Busy — please wait">
                                                              <uui-button look="${this._historicalIndex === t.index ? "primary" : "outline"}" compact class="history-load-btn">
                                                                  ${this._historicalIndex === t.index ? "Loaded" : "Load"}
                                                              </uui-button>
                                                            </span>` : s`<uui-button look="${this._historicalIndex === t.index ? "primary" : "outline"}" compact
                                                              class="history-load-btn"
                                                              @click=${() => this._loadHistoryEntry(t.index, t.scannedAt)}
                                                              title="Load this scan">
                                                              ${this._historicalIndex === t.index ? "Loaded" : "Load"}
                                                           </uui-button>`}
                                            <uui-button look="outline" compact
                                                @click=${() => this._exportHistoryCsv(t.index)}
                                                title="Export this scan as CSV">
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
                                                @click=${() => this._deleteHistoryEntry(t.index)}
                                                title="Delete this entry">Delete</uui-button>
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
                ` : d}
            </div>
        `;
  }
  _renderResults() {
    const t = this._result, a = this._sortedPages(), o = Math.round(t.averageScore), r = _(o), l = { A: "#1a7a4a", B: "#1a6b2a", C: "#b7770d", D: "#d35400", F: "#c0392b" }[r] ?? "#6b7280", i = this._delta();
    return s`
            <!-- ── Stat cards ── -->
            <div class="stats-row">
                <div class="stat-card stat-card--violations">
                    <div class="stat-card__icon">${A}</div>
                    <div class="stat-card__info">
                        <div class="stat-card__value-row">
                            <span class="stat-card__value count-up" data-target="${t.totalViolations}">${t.totalViolations}</span>
                            ${i && i.violations !== 0 ? s`
                                <span class="delta-badge ${i.violations > 0 ? "delta-badge--down" : "delta-badge--up"}">
                                    ${i.violations > 0 ? "▲" : "▼"}${Math.abs(i.violations)}
                                </span>
                            ` : d}
                        </div>
                        <span class="stat-card__label">Total violations</span>
                    </div>
                </div>
                <div class="stat-card stat-card--pages">
                    <div class="stat-card__icon">${z}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value count-up" data-target="${t.totalPages}">${t.totalPages}</span>
                        <span class="stat-card__label">Pages found</span>
                    </div>
                </div>
                <div class="stat-card stat-card--scanned">
                    <div class="stat-card__icon">${H}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value count-up" data-target="${t.scannedPages}">${t.scannedPages}</span>
                        <span class="stat-card__label">Pages scanned</span>
                    </div>
                </div>
                <div class="stat-card stat-card--score" style="--score-color: ${l}">
                    <div class="stat-card__icon">${E}</div>
                    <div class="stat-card__info">
                        <div class="stat-card__value-row">
                            <span class="stat-card__value stat-card__value--score count-up" data-target="${o}">${o}</span>
                            ${i && i.score !== 0 ? s`
                                <span class="delta-badge ${i.score > 0 ? "delta-badge--up" : "delta-badge--down"}">
                                    ${i.score > 0 ? "▲" : "▼"}${Math.abs(i.score)}
                                </span>
                            ` : d}
                        </div>
                        <span class="stat-card__label">Average score</span>
                    </div>
                </div>
                ${t.skippedPages > 0 ? s`
                    <div class="stat-card stat-card--skipped">
                        <div class="stat-card__icon">${P}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${t.skippedPages}</span>
                            <span class="stat-card__label">Skipped</span>
                        </div>
                    </div>
                ` : d}
            </div>

            <!-- ── Page results exec-card ── -->
            <div class="exec-card results-card">
                <h4 class="exec-card__heading">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                        <path d="M9 12l2 2l4 -4" />
                    </svg>
                    Page results
                    <span class="results-card__count">${t.scannedPages} scanned${t.skippedPages > 0 ? `, ${t.skippedPages} skipped` : ""}</span>
                    <div style="margin-left: auto; display: flex; gap: var(--uui-size-space-2); flex-shrink: 0;">
                        <uui-button look="outline" compact @click=${this._exportCsv}>
                            <span class="btn-content">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                </svg>
                                Export CSV
                            </span>
                        </uui-button>
                        <uui-button look="primary" compact
                            @click=${() => {
      this._resultsExpanded = !this._resultsExpanded;
    }}>
                            <span class="btn-content">
                                ${this._resultsExpanded ? "Collapse" : "Show"}
                                <svg class="btn-icon chevron-icon ${this._resultsExpanded ? "chevron-icon--up" : ""}"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M6 9l6 6l6 -6" />
                                </svg>
                            </span>
                        </uui-button>
                    </div>
                </h4>

                ${this._resultsExpanded ? s`
                    <uui-table>
                        <uui-table-head>
                            <uui-table-head-cell class="sortable col-name" @click=${() => this._setSort("name")}>
                                Page ${this._sortBy === "name" ? this._sortAsc ? "↑" : "↓" : ""}
                            </uui-table-head-cell>
                            <uui-table-head-cell class="col-grade">Grade</uui-table-head-cell>
                            <uui-table-head-cell class="sortable col-score" @click=${() => this._setSort("score")}>
                                Score ${this._sortBy === "score" ? this._sortAsc ? "↑" : "↓" : ""}
                            </uui-table-head-cell>
                            <uui-table-head-cell class="sortable col-violations" @click=${() => this._setSort("violations")}>
                                Violations ${this._sortBy === "violations" ? this._sortAsc ? "↑" : "↓" : ""}
                            </uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--critical">Critical</uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--serious">Serious</uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--moderate">Moderate</uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--minor">Minor</uui-table-head-cell>
                            <uui-table-head-cell class="col-passes">Passes</uui-table-head-cell>
                            <uui-table-head-cell class="col-url">URL</uui-table-head-cell>
                            <uui-table-head-cell class="col-actions"></uui-table-head-cell>
                        </uui-table-head>

                        ${a.map((e) => e.skipped ? s`
                            <uui-table-row class="row-skipped">
                                <uui-table-cell class="col-name cell-name">
                                    <div class="page-name-cell" style="padding-left: ${e.depth * 18}px">
                                        ${e.depth > 0 ? s`<svg class="tree-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 16 16"><path d="M4 2v8h9"/></svg>` : d}
                                        <umb-icon name="${e.contentTypeIcon}" class="doctype-icon"></umb-icon>
                                        <span class="page-node-link"
                                            @click=${() => history.pushState(null, "", `/umbraco/section/content/workspace/document/${e.key}`)}>
                                            ${e.name ?? e.key}
                                        </span>
                                        <em class="skip-reason">${e.skipReason}</em>
                                    </div>
                                </uui-table-cell>
                                <uui-table-cell class="col-grade"><span class="na-badge">N/A</span></uui-table-cell>
                                <uui-table-cell class="col-score"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-violations"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-impact"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-impact"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-impact"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-impact"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-passes"><span class="na-text">—</span></uui-table-cell>
                                <uui-table-cell class="col-url"><span class="not-published">Not published</span></uui-table-cell>
                                <uui-table-cell class="col-actions">
                                    <a href="/umbraco/section/content/workspace/document/edit/${e.key}/invariant/view/uaccessible" class="workspace-link-btn" title="View page results in workspace"
                                        @click=${() => sessionStorage.setItem("uaccessible:autoload", e.key)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                            <path d="M9 12l2 2l4 -4" />
                                        </svg>
                                        View page results
                                    </a>
                                </uui-table-cell>
                            </uui-table-row>
                        ` : s`
                            <uui-table-row class="${e.criticalCount > 0 ? "row-critical" : e.seriousCount > 0 ? "row-serious" : ""}">
                                <uui-table-cell class="col-name cell-name">
                                    <div class="page-name-cell" style="padding-left: ${e.depth * 18}px">
                                        ${e.depth > 0 ? s`<svg class="tree-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 16 16"><path d="M4 2v8h9"/></svg>` : d}
                                        <umb-icon name="${e.contentTypeIcon}" class="doctype-icon"></umb-icon>
                                        <a href="/umbraco/section/content/workspace/document/${e.key}" class="page-node-link">
                                            ${e.name ?? e.key}
                                        </a>
                                    </div>
                                </uui-table-cell>
                                <uui-table-cell class="col-grade">
                                    <span class="grade-circle" style="color: ${x(e.grade)};">${e.grade}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-score">
                                    <span class="score-val">${e.score}/100</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-violations">
                                    <span class="count-badge count-badge--violations">${e.violationCount}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--critical">${e.criticalCount}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--serious">${e.seriousCount}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--moderate">${e.moderateCount ?? 0}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--minor">${e.minorCount ?? 0}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-passes">
                                    <span class="count-badge count-badge--passes">${e.passingCount ?? 0}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-url">
                                    ${e.url ? s`<a href="${e.url}" target="_blank" rel="noopener noreferrer" class="page-link">${e.url}</a>` : "—"}
                                </uui-table-cell>
                                <uui-table-cell class="col-actions">
                                    <a href="/umbraco/section/content/workspace/document/edit/${e.key}/invariant/view/uaccessible" class="workspace-link-btn" title="View page results in workspace"
                                        @click=${() => sessionStorage.setItem("uaccessible:autoload", e.key)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                            <path d="M9 12l2 2l4 -4" />
                                        </svg>
                                        View page results
                                    </a>
                                </uui-table-cell>
                            </uui-table-row>
                        `)}
                    </uui-table>
                ` : d}
            </div>
        `;
  }
};
c.styles = [
  w`
            :host { display: block; padding: var(--uui-size-layout-1); }

            .layout { display: flex; flex-direction: column; gap: var(--uui-size-layout-1); }

            /* ── Header ── */
            .dash-header { display: flex; align-items: center; gap: var(--uui-size-space-5); }
            .dash-logo { width: 72px; height: 72px; flex-shrink: 0; object-fit: contain; }
            .dash-header-text h2 { margin: 0 0 var(--uui-size-space-2); font-size: var(--uui-type-large-size, 18px); font-weight: 700; color: var(--uui-color-text); }
            .dash-header-text p  { margin: 0; font-size: 13px; color: var(--uui-color-text-alt); line-height: 1.5; }

            /* ── Picker row ── */
            .picker-row { display: flex; align-items: center; gap: var(--uui-size-space-3); flex-wrap: wrap; }
            .picker-field { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid var(--uui-color-border, #d8d7d9); border-radius: var(--uui-border-radius, 3px); background: var(--uui-color-surface, #fff); font-size: 13px; }
            .picker-placeholder { color: var(--uui-color-text-alt, #6b7280); }
            .selected-node { display: flex; align-items: center; gap: var(--uui-size-space-2); }
            .selected-node svg { width: 16px; height: 16px; flex-shrink: 0; color: #27ae60; }
            .selected-node__name { flex: 1; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .selected-node__clear { background: none; border: none; cursor: pointer; font-size: 16px; line-height: 1; color: var(--uui-color-text-alt); padding: 0 2px; }
            .selected-node__clear:hover { color: #c0392b; }

            /* ── Historical card ── */
            .historical-card__header { display: flex; align-items: center; gap: var(--uui-size-space-4); }
            .historical-card__icon { width: 22px; height: 22px; flex-shrink: 0; color: var(--uui-color-text-alt, #6b7280); }
            .historical-card__content { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
            .historical-card__label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--uui-color-text-alt, #6b7280); }
            .historical-card__date { font-size: 14px; font-weight: 700; color: var(--uui-color-text, #1a1a1a); }
            .historical-card__meta { font-size: 12px; color: var(--uui-color-text-alt, #6b7280); }

            /* ── Section heading (matches workspace) ── */
            .section-heading {
                display: flex; align-items: center; gap: var(--uui-size-space-2);
                font-size: 15px; font-weight: 700; color: var(--uui-color-text, #1a1a1a);
                border-bottom: 2px solid var(--uui-color-border, #d8d7d9);
                padding-bottom: var(--uui-size-space-3); margin: 0 0 var(--uui-size-space-4);
            }
            .section-heading svg { width: 20px; height: 20px; flex-shrink: 0; }
            .section-heading-count { font-size: 13px; font-weight: 400; color: var(--uui-color-text-alt, #6b7280); margin-left: 2px; }
            .section-heading--history uui-button, .history-toggle-btn { margin-left: auto; flex-shrink: 0; }
            .history-section { margin-bottom: 0; }
            .history-table-card { margin-top: 0; }

            /* ── Exec-card ── */
            .exec-card {
                background: var(--uui-color-surface, #fff);
                border: 1px solid var(--uui-color-border, #d8d7d9);
                border-radius: var(--uui-border-radius, 3px);
                padding: var(--uui-size-space-4);
            }
            .exec-card__heading {
                margin: 0 0 var(--uui-size-space-3);
                font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
                color: var(--uui-color-text, #1a1a1a);
                display: flex; align-items: center; gap: var(--uui-size-space-3);
            }
            .exec-card__heading svg { width: 18px; height: 18px; flex-shrink: 0; }
            .exec-card__subtitle { margin: 0 0 var(--uui-size-space-4); font-size: 13px; color: var(--uui-color-text-alt, #6b7280); }
            .history-card__count, .results-card__count {
                font-size: 11px; font-weight: 400; color: var(--uui-color-text-alt, #6b7280);
                text-transform: none; letter-spacing: normal;
            }

            /* ── Stat cards ── */
            .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--uui-size-space-3); padding: var(--uui-size-space-3) 0; }

            .stat-card {
                position: relative; display: flex; flex-direction: row; align-items: center;
                gap: var(--uui-size-space-3); padding: var(--uui-size-space-4);
                border-radius: var(--uui-border-radius, 3px);
                background: var(--uui-color-surface, #fff); border: 1px solid var(--uui-color-border, #d8d7d9);
                overflow: hidden;
            }
            .stat-card::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            }
            .stat-card--pages::before      { background: #2471a3; }
            .stat-card--scanned::before    { background: #27ae60; }
            .stat-card--score::before      { background: var(--score-color, #b7770d); }
            .stat-card--violations::before { background: #c0392b; }
            .stat-card--skipped::before    { background: #b7770d; }

            .stat-card__icon { width: 36px; height: 36px; flex-shrink: 0; }
            .stat-card__icon svg { width: 100%; height: 100%; }
            .stat-card--pages .stat-card__icon      { color: #2471a3; }
            .stat-card--scanned .stat-card__icon    { color: #27ae60; }
            .stat-card--score .stat-card__icon      { color: var(--score-color, #b7770d); }
            .stat-card--violations .stat-card__icon { color: #c0392b; }
            .stat-card--skipped .stat-card__icon    { color: #b7770d; }

            .stat-card__info { display: flex; flex-direction: column; gap: 2px; }
            .stat-card__value-row { display: flex; align-items: baseline; gap: 6px; }
            .stat-card__value { font-size: 26px; font-weight: 800; line-height: 1; color: var(--uui-color-text, #1a1a1a); }
            .stat-card__value--score { color: var(--score-color, inherit); }
            .stat-card__label { font-size: 13px; font-weight: 600; color: var(--uui-color-text, #1a1a1a); white-space: nowrap; }

            /* ── Delta badges ── */
            .delta-badge {
                font-size: 11px; font-weight: 700; padding: 1px 5px;
                border-radius: 3px; line-height: 1.3;
            }
            .delta-badge--up   { background: rgba(39,174,96,0.14);  color: #1a7a4a; }
            .delta-badge--down { background: rgba(192,57,43,0.14);  color: #c0392b; }

            /* ── History table ── */
            .history-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .history-table th, .history-table td {
                padding: 8px 12px; text-align: left;
                border-bottom: 1px solid var(--uui-color-border, #d8d7d9);
            }
            .history-table thead th {
                font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
                color: var(--uui-color-text-alt, #6b7280);
            }
            .history-table thead th.th--violations { color: #8b1a1a; }
            .history-table thead th.th--critical   { color: #c0392b; }
            .history-table thead th.th--serious    { color: #d35400; }
            .history-table thead th.th--moderate   { color: #b7770d; }
            .history-table thead th.th--minor      { color: #2471a3; }
            .history-table thead th.th--passes     { color: #1a7a4a; }
            .history-table tbody tr:last-child td { border-bottom: none; }
            .history-row--latest td { font-weight: 600; }
            .history-row--active td { background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 6%, transparent); }
            .history-load-btn {
                min-width: 4.5rem;
            }
            .history-load-btn[disabled] {
                pointer-events: none;
                opacity: 0.45;
            }

            .scan-progress-track {
                width: 100%;
                height: 4px;
                background: var(--uui-color-border, #d8d7d9);
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

            .history-actions { display: flex; gap: var(--uui-size-space-2); white-space: nowrap; }
            .history-action-disabled {
                display: inline-block;
                opacity: 0.35;
                pointer-events: none;
                cursor: not-allowed;
            }
            .history-footer { padding: var(--uui-size-space-3) 0 0; display: flex; justify-content: flex-start; }
            .history-grade {
                display: inline-block; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 3px;
            }
            .history-grade--a { background: rgba(39,174,96,0.15);  color: #1a7a4a; }
            .history-grade--b { background: rgba(46,204,113,0.15); color: #1a6b2a; }
            .history-grade--c { background: rgba(243,156,18,0.15); color: #b7770d; }
            .history-grade--d { background: rgba(230,126,34,0.15); color: #d35400; }
            .history-grade--f { background: rgba(231,76,60,0.15);  color: #c0392b; }

            /* ── uui-table header normalisation — match <th> style ── */
            uui-table-head-cell {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--uui-color-text-alt, #6b7280);
            }
            uui-table-head-cell.col-violations       { color: #8b1a1a; }
            uui-table-head-cell.col-impact--critical { color: #c0392b; }
            uui-table-head-cell.col-impact--serious  { color: #d35400; }
            uui-table-head-cell.col-impact--moderate { color: #b7770d; }
            uui-table-head-cell.col-impact--minor    { color: #2471a3; }
            uui-table-head-cell.col-passes           { color: #1a7a4a; }

            /* ── uui-table columns ── */
            .col-name       { width: auto; }
            .col-grade      { width: 70px; }
            .col-score      { width: 90px; white-space: nowrap; }
            .col-violations { width: 100px; }
            .col-impact     { width: 80px; }
            .col-passes     { width: 80px; }
            .col-url        { width: 260px; }
            .col-actions    { width: 130px; text-align: center; white-space: nowrap; }

            .workspace-link-btn {
                display: inline-flex; align-items: center; justify-content: center; gap: 4px;
                padding: 3px 8px; height: 28px; border-radius: var(--uui-border-radius, 3px);
                color: var(--uui-color-interactive, #3544b1); font-size: 12px; font-weight: 600;
                border: 1px solid var(--uui-color-border, #d8d7d9);
                text-decoration: none; white-space: nowrap; transition: background 0.15s, border-color 0.15s;
            }
            .workspace-link-btn svg { width: 13px; height: 13px; flex-shrink: 0; }
            .workspace-link-btn:hover {
                background: color-mix(in srgb, var(--uui-color-interactive, #3544b1) 8%, transparent);
                border-color: var(--uui-color-interactive, #3544b1);
            }

            .sortable { cursor: pointer; user-select: none; }
            .cell-name { display: flex; flex-direction: column; gap: 2px; }
            .score-val { font-size: 12px; color: var(--uui-color-text-alt, #6b7280); margin-left: 4px; }

            .page-name-cell { display: flex; align-items: center; gap: 6px; }
            .doctype-icon { width: 16px; height: 16px; flex-shrink: 0; color: var(--uui-color-text-alt, #6b7280); }
            .tree-arrow { width: 12px; height: 12px; flex-shrink: 0; color: var(--uui-color-border, #b0adb8); }
            .page-node-link {
                color: var(--uui-color-interactive, #3544b1); text-decoration: none;
                font-weight: 600; cursor: pointer;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            .page-node-link:hover { text-decoration: underline; }

            .grade-circle {
                display: inline-flex; align-items: center; justify-content: center;
                width: 28px; height: 28px; border-radius: 50%;
                border: 2px solid currentColor;
                background: color-mix(in srgb, currentColor 15%, transparent);
                font-weight: 800; font-size: 12px; flex-shrink: 0;
            }

            .count-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 3px; }
            .count-badge--violations { background: rgba(139,26,26,0.12); color: #8b1a1a; }
            .count-badge--critical { background: rgba(192,57,43,0.12); color: #c0392b; }
            .count-badge--serious  { background: rgba(211,84,0,0.12);  color: #d35400; }
            .count-badge--moderate { background: rgba(183,119,13,0.12); color: #b7770d; }
            .count-badge--minor    { background: rgba(36,113,163,0.12); color: #2471a3; }
            .count-badge--passes   { background: rgba(39,174,96,0.12); color: #1a7a4a; }
            .count-zero { color: var(--uui-color-text-alt, #9ca3af); font-size: 13px; }

            .row-critical { --uui-table-row-background: rgba(192,57,43,0.04); }
            .row-serious  { --uui-table-row-background: rgba(211,84,0,0.04); }
            .row-skipped  { --uui-table-row-background: var(--uui-color-surface-alt, #f9f9f9); }

            .na-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; background: var(--uui-color-surface-alt, #f3f3f5); border: 1px solid var(--uui-color-border, #d8d7d9); color: var(--uui-color-text-alt, #9ca3af); letter-spacing: 0.04em; }
            .na-text { color: var(--uui-color-text-alt, #9ca3af); font-size: 13px; }
            .not-published { font-size: 12px; color: var(--uui-color-text-alt, #9ca3af); font-style: italic; }
            .skip-reason { font-size: 12px; color: var(--uui-color-text-alt, #6b7280); }

            .page-link { font-size: 12px; color: var(--uui-color-interactive, #3544b1); text-decoration: none; max-width: 240px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
            .page-link:hover { text-decoration: underline; }

            .btn-content { display: inline-flex; align-items: center; gap: 5px; }
            .btn-icon { width: 14px; height: 14px; }
            .chevron-icon { transition: transform 0.2s ease; }
            .chevron-icon--up { transform: rotate(180deg); }
        `
];
u([
  h()
], c.prototype, "_selectedKey", 2);
u([
  h()
], c.prototype, "_selectedName", 2);
u([
  h()
], c.prototype, "_scanning", 2);
u([
  h()
], c.prototype, "_scanInProgress", 2);
u([
  h()
], c.prototype, "_result", 2);
u([
  h()
], c.prototype, "_error", 2);
u([
  h()
], c.prototype, "_sortBy", 2);
u([
  h()
], c.prototype, "_sortAsc", 2);
u([
  h()
], c.prototype, "_resultsExpanded", 2);
u([
  h()
], c.prototype, "_siteHistory", 2);
u([
  h()
], c.prototype, "_historyExpanded", 2);
u([
  h()
], c.prototype, "_historyLoading", 2);
u([
  h()
], c.prototype, "_historicalIndex", 2);
u([
  h()
], c.prototype, "_historicalDate", 2);
c = u([
  k("uaccessible-dashboard")
], c);
const R = c;
export {
  R as default,
  c as uAccessibleDashboardElement
};
//# sourceMappingURL=dashboard.element-0vBR6oWt.js.map
