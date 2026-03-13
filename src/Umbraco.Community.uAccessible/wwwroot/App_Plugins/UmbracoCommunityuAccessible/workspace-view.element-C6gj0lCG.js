import { LitElement as A, html as s, nothing as l, css as I, state as p, customElement as P } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as T } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as B } from "@umbraco-cms/backoffice/document";
import { UMB_AUTH_CONTEXT as R } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as j } from "@umbraco-cms/backoffice/notification";
var q = Object.defineProperty, O = Object.getOwnPropertyDescriptor, d = (e, t, a, i) => {
  for (var r = i > 1 ? void 0 : i ? O(t, a) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, a, r) : o(r)) || r);
  return i && r && q(t, a, r), r;
};
const H = "/umbraco/umbracommunityuaccessible/api/v1", V = ["critical", "serious", "moderate", "minor"], z = {
  critical: "#c0392b",
  serious: "#d35400",
  moderate: "#b7770d",
  minor: "#2471a3"
}, C = {
  critical: "rgba(192,57,43,0.12)",
  serious: "rgba(211,84,0,0.12)",
  moderate: "rgba(183,119,13,0.12)",
  minor: "rgba(36,113,163,0.10)"
};
function G(e) {
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
function L(e) {
  const t = {
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
  for (const i of e)
    t[i] && a.add(t[i]);
  return [...a];
}
function S(e) {
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
const _ = s`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
    <path d="M11 13l9 -9" />
    <path d="M15 4h5v5" />
</svg>`, U = s`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M21 2v6h-6"/>
    <path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>
</svg>`, D = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
</svg>`, F = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`, W = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
</svg>`, N = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
</svg>`, X = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
</svg>`, K = s`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    class="reason-icon">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
</svg>`, Q = s`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    class="reason-icon reason-icon--pass">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`, Y = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>`;
let c = class extends T(A) {
  constructor() {
    super(...arguments), this._loading = !1, this._result = null, this._error = null, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._activeImpact = null, this._allCollapsed = !1, this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !1, this._displayScore = 0, this._displayGrade = "?", this._displayColor = { color: "#6b7280", ring: "#9ca3af" }, this._displayViolations = 0, this._displayPasses = 0, this._displayIncomplete = 0, this._displayRules = 0, this._unique = null, this._tokenProvider = null, this._notificationContext = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(R, (e) => {
      this._tokenProvider = (e == null ? void 0 : e.getOpenApiConfiguration().token) ?? null;
    }), this.consumeContext(j, (e) => {
      this._notificationContext = e ?? null;
    }), this.consumeContext(B, async (e) => {
      var a;
      const t = (a = e == null ? void 0 : e.getUnique) == null ? void 0 : a.call(e);
      t && (this._unique = t);
    });
  }
  // -----------------------------------------------------------------------
  // API call
  // -----------------------------------------------------------------------
  async _runAudit() {
    var e, t;
    if (this._unique) {
      this._loading = !0, this._result = null, this._error = null, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._activeImpact = null, this._allCollapsed = !1, this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !1, this._displayScore = 0, this._displayGrade = "?", this._displayColor = { color: "#6b7280", ring: "#9ca3af" }, this._displayViolations = 0, this._displayPasses = 0, this._displayIncomplete = 0, this._displayRules = 0;
      try {
        const a = this._tokenProvider ? await this._tokenProvider() : void 0, i = await fetch(`${H}/audit/key/${this._unique}`, {
          headers: {
            Accept: "application/json",
            ...a ? { Authorization: `Bearer ${a}` } : {}
          }
        });
        if (!i.ok) throw new Error(`${i.status} ${i.statusText}`);
        if (this._result = await i.json(), this._result && !this._result.fetchError) {
          this._animateScore(this._result.score ?? 0, this._result.grade);
          const r = this._result.violations.length;
          r === 0 ? (e = this._notificationContext) == null || e.peek("positive", {
            data: { headline: "No violations found", message: `Grade ${this._result.grade} — all automated checks passed.` }
          }) : (t = this._notificationContext) == null || t.peek("danger", {
            data: { headline: `${r} violation${r !== 1 ? "s" : ""} found`, message: `Grade ${this._result.grade}` }
          });
        }
      } catch (a) {
        this._error = a instanceof Error ? a.message : "An unexpected error occurred.";
      } finally {
        this._loading = !1;
      }
    }
  }
  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------
  _toggleItem(e, t) {
    const a = new Set(t);
    return a.has(e) ? a.delete(e) : a.add(e), a;
  }
  _toggleAll() {
    this._result && (this._allCollapsed ? (this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._collapsedPasses = /* @__PURE__ */ new Set(), this._violationsExpanded = !0, this._reviewExpanded = !0, this._passesExpanded = !0, this._allCollapsed = !1) : (this._collapsed = new Set(this._result.violations.map((e) => e.id)), this._collapsedIncomplete = new Set(this._result.incomplete.map((e) => e.id)), this._collapsedPasses = new Set(this._result.passingChecks.map((e) => e.id)), this._violationsExpanded = !1, this._reviewExpanded = !1, this._passesExpanded = !1, this._allCollapsed = !0));
  }
  _filteredViolations() {
    if (!this._result) return [];
    const e = this._result.violations;
    return this._activeImpact ? e.filter((t) => t.impact === this._activeImpact) : e;
  }
  _quickWins() {
    if (!this._result) return [];
    const e = ["minor", "moderate", "serious", "critical"];
    return [...this._result.violations].sort((t, a) => {
      const i = e.indexOf(t.impact ?? "minor"), r = e.indexOf(a.impact ?? "minor");
      return i !== r ? i - r : t.nodes.length - a.nodes.length;
    }).slice(0, 5);
  }
  _audiences() {
    if (!this._result) return [];
    const e = /* @__PURE__ */ new Set();
    for (const t of this._result.violations)
      for (const a of L(t.tags)) e.add(a);
    return [...e];
  }
  _uniqueRulesCount() {
    return this._result ? new Set(this._result.violations.map((e) => e.id)).size : 0;
  }
  _wcagTags(e) {
    return e.filter((t) => t.startsWith("wcag") || t === "best-practice");
  }
  // Returns true when the target selector is specific enough to be useful in DevTools
  // (i.e. not just a bare tag name like "h4" or "p")
  _isSpecificSelector(e) {
    return /[#.\s>+~\[:]/.test(e);
  }
  _animateScore(e, t) {
    var w, k, y;
    const i = performance.now(), r = G(t), n = ["A", "B", "C", "D", "F"], o = Math.max(0, n.indexOf(t)), g = 25, u = ((o - g) % n.length + n.length) % n.length, v = ((w = this._result) == null ? void 0 : w.summary.totalViolations) ?? 0, h = ((k = this._result) == null ? void 0 : k.summary.passes) ?? 0, m = ((y = this._result) == null ? void 0 : y.summary.incompleteCount) ?? 0, x = this._uniqueRulesCount(), b = (M) => {
      const E = M - i, $ = Math.min(E / 1800, 1), f = 1 - Math.pow(1 - $, 3);
      this._displayScore = Math.round(f * e), this._displayGrade = n[(u + Math.floor(f * g)) % n.length], this._displayViolations = Math.round(f * v), this._displayPasses = Math.round(f * h), this._displayIncomplete = Math.round(f * m), this._displayRules = Math.round(f * x), $ < 1 ? requestAnimationFrame(b) : (this._displayScore = e, this._displayGrade = t, this._displayColor = r, this._displayViolations = v, this._displayPasses = h, this._displayIncomplete = m, this._displayRules = x);
    };
    requestAnimationFrame(b);
  }
  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  render() {
    var t, a;
    if (this._loading)
      return s`<div class="loader"><uui-loader></uui-loader></div>`;
    const e = ((t = this._result) == null ? void 0 : t.published) && !this._result.fetchError;
    return s`
            <div class="page-header">
                <div class="page-header-main">
                    <img
                        class="page-logo"
                        src="/App_Plugins/UmbracoCommunityuAccessible/images/uAccessible_logo.png"
                        alt="uAccessible"
                    />
                    <div>
                        <h3 class="page-title">
                            <strong>uAccessible:</strong> Accessibility Auditor
                        </h3>
                        <p class="page-description">
                            Scans the last published version of this page using
                            <strong>axe-core</strong> and reports WCAG 2.0, 2.1 &amp; 2.2
                            violations (Levels A &amp; AA).
                        </p>
                    </div>
                </div>
                <div class="header-actions">
                    ${e && ((a = this._result) != null && a.url) ? s`
                        <uui-button look="outline"
                            href=${this._result.url}
                            target="_blank"
                            title="Open the published page in a new tab">
                            <span class="btn-content">View page ${_}</span>
                        </uui-button>
                    ` : l}
                    <uui-button
                        look="primary"
                        color="positive"
                        @click=${this._runAudit}
                        ?disabled=${this._loading}
                        title=${this._result ? "Re-run accessibility audit" : "Run accessibility audit"}>
                        <span class="btn-content">
                            ${this._result ? s`Re-run Audit ${U}` : "Run Audit"}
                        </span>
                    </uui-button>
                </div>
            </div>

            ${this._renderBody()}
        `;
  }
  _renderBody() {
    var n;
    if (this._error)
      return s`<uui-alert color="danger">${this._error}</uui-alert>`;
    if (!this._result)
      return s`
                <uui-alert>
                    <p class="state-msg">Click <strong>Run Audit</strong> to check this page for accessibility issues against its last published version.</p>
                    <p class="state-hint">Powered by axe-core &mdash; checks WCAG 2.0, 2.1 &amp; 2.2 (Levels A &amp; AA)</p>
                </uui-alert>
            `;
    if (!this._result.published)
      return s`
                <uui-alert headline="Page not published">
                    <p class="state-msg">This page hasn't been published yet — there is no public URL to audit.</p>
                    <p class="state-hint">Publish the page from the <strong>Info</strong> tab, then click <strong>Run Audit</strong> above.</p>
                </uui-alert>
            `;
    if (this._result.fetchError)
      return s`
                <uui-alert color="warning" headline="Could not load page">
                    <p class="state-msg">${this._result.fetchError}</p>
                    ${this._result.url ? s`
                        <div class="fetch-url-box">
                            <span class="fetch-url-label">URL attempted</span>
                            <code class="fetch-url-code">${this._result.url}</code>
                        </div>
                    ` : l}
                </uui-alert>
            `;
    const { violations: e, incomplete: t } = this._result, a = this._filteredViolations(), i = this._quickWins(), r = this._audiences();
    return s`
            <!-- ── Grade ring + stat cards row ── -->
            <div class="top-row">
                <!-- Grade ring -->
                <div class="grade-ring" style="--ring-color: ${this._displayColor.ring}; --text-color: ${this._displayColor.color}">
                    <span class="grade-ring__letter">${this._displayGrade}</span>
                    <span class="grade-ring__score">${this._displayScore}/100</span>
                </div>

                <!-- Stat cards -->
                <div class="stats-row">
                    <div class="stat-card stat-card--violations">
                        <div class="stat-card__icon">${D}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayViolations}</span>
                            <span class="stat-card__label">Violations</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--passes">
                        <div class="stat-card__icon">${F}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayPasses}</span>
                            <span class="stat-card__label">Passing</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--review">
                        <div class="stat-card__icon">${W}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayIncomplete}</span>
                            <span class="stat-card__label">Needs Review</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--rules">
                        <div class="stat-card__icon">${N}</div>
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
                    ${V.map((o) => {
      const g = e.filter((h) => h.impact === o).length, u = this._activeImpact === o, v = this._activeImpact !== null && !u;
      return s`
                            <button
                                class="impact-pill impact-pill--${o} ${v ? "impact-pill--dimmed" : ""} ${u ? "impact-pill--active" : ""}"
                                style="--pill-color: ${z[o]}; --pill-bg: ${C[o]}"
                                @click=${() => {
        this._activeImpact = u ? null : o;
      }}
                                title="Filter by ${o} violations">
                                ${o.charAt(0).toUpperCase() + o.slice(1)}: ${g}
                            </button>
                        `;
    })}
                </div>
                ${e.length > 0 || t.length > 0 ? s`
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

            ${this._activeImpact ? s`
                <p class="filter-hint">
                    Showing <strong>${this._activeImpact}</strong> violations only &mdash;
                    click the pill again to clear.
                </p>
            ` : l}

            <!-- ── Who is affected + Quick wins ── -->
            ${(i.length > 0 || r.length > 0) && !this._activeImpact ? s`
                <div class="exec-row">
                    ${r.length > 0 ? s`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${Y} Who is affected
                            </h4>
                            <p class="exec-card__subtitle">Accessibility groups impacted by violations on this page</p>
                            <div class="audience-chips">
                                ${r.map((o) => s`
                                    <span class="audience-chip">${o}</span>
                                `)}
                            </div>
                        </div>
                    ` : l}

                    ${i.length > 0 ? s`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${X} Quick wins
                            </h4>
                            <p class="exec-card__subtitle">Lowest effort fixes — address these first</p>
                            <ul class="quick-wins-list">
                                ${i.map((o) => s`
                                    <li class="quick-win">
                                        <span class="effort-badge effort-badge--${S(o.impact).toLowerCase()}">
                                            ${S(o.impact).toUpperCase()}
                                        </span>
                                        <span class="quick-win__text">
                                            <span class="quick-win__title">${o.help}</span>
                                            <span class="quick-win__nodes">${o.nodes.length} element${o.nodes.length !== 1 ? "s" : ""}</span>
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

            ${this._violationsExpanded ? s`
                ${e.length === 0 ? s`
                    <uui-alert color="positive" headline="No violations found">
                        <p class="state-msg">This page passed all automated accessibility checks.</p>
                    </uui-alert>
                ` : a.length === 0 ? s`
                    <uui-alert>No ${this._activeImpact} violations on this page.</uui-alert>
                ` : s`
                    <div class="violations-list">
                        ${a.map((o) => this._renderViolation(o, "violations"))}
                    </div>
                `}
            ` : l}

            <!-- ── Incomplete / needs review ── -->
            ${t.length > 0 ? s`
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
                        (<strong>${t.length}</strong>
                        item${t.length !== 1 ? "s" : ""} require manual verification)
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
                ${this._reviewExpanded ? s`
                    <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                        ${t.map((o) => this._renderViolation(o, "incomplete"))}
                    </div>
                ` : l}
            ` : l}

            <!-- ── Passing checks ── -->
            ${((n = this._result.passingChecks) == null ? void 0 : n.length) > 0 ? s`
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
                ${this._passesExpanded ? s`
                    <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                        ${this._result.passingChecks.map((o) => this._renderPassingCheck(o))}
                    </div>
                ` : l}
            ` : l}
        `;
  }
  _renderViolation(e, t) {
    const i = (t === "violations" ? this._collapsed : this._collapsedIncomplete).has(e.id), r = this._wcagTags(e.tags), n = e.impact ?? "minor", o = z[n] ?? "#6b7280", g = C[n] ?? "rgba(0,0,0,0.06)";
    return s`
            <uui-box class="block-box block-box--${n}${i ? " block-box--collapsed" : ""}">
                <div slot="headline" class="block-headline">
                    <span class="impact-badge" style="--badge-color: ${o}; --badge-bg: ${g}">
                        ${n.charAt(0).toUpperCase() + n.slice(1)}
                    </span>
                    <span class="block-headline__text">${e.help}</span>
                    ${r.length > 0 ? s`
                        <div class="block-headline__tags">
                            ${r.map((u) => s`<span class="tag">${u}</span>`)}
                        </div>
                    ` : l}
                </div>

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => {
      t === "violations" ? this._collapsed = this._toggleItem(e.id, this._collapsed) : this._collapsedIncomplete = this._toggleItem(e.id, this._collapsedIncomplete);
    }}>
                    <span class="btn-content">
                        ${i ? "Expand" : "Collapse"}
                        <svg class="btn-icon chevron-icon ${i ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                    </span>
                </uui-button>

                ${i ? l : s`
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
                                <span class="btn-content">Learn more ${_}</span>
                            </uui-button>
                        </div>

                        <h5 class="nodes-heading">
                            <span>${e.nodes.length} affected element${e.nodes.length === 1 ? "" : "s"}</span>
                        </h5>
                        <div class="nodes-list">
                            ${e.nodes.map((u, v) => s`
                                <div class="node">
                                    <div class="node__header">
                                        <span class="node__index" style="background: ${o}; color: #fff;">${v + 1}</span>
                                        ${u.failureSummary ? s`<span class="node__reasons-label">WHY THIS FAILS</span>` : l}
                                    </div>
                                    <div class="node__content">
                                        ${u.failureSummary ? s`
                                            <ul class="node__reasons-list">
                                                ${u.failureSummary.split("; ").filter((h) => h.length > 0).map((h) => s`<li class="node__reasons-item" style="color: ${o};">${K}<span>${h}</span></li>`)}
                                            </ul>
                                        ` : l}
                                        <span class="node__html-label">IMPACTED CODE</span>
                                        <pre class="node__html"><code>${u.html}</code></pre>
                                        ${this._isSpecificSelector(u.target) ? s`
                                            <div class="node__selector">
                                                <span class="node__selector-label">CSS SELECTOR</span>
                                                <p class="node__selector-hint">Copy and paste into browser DevTools (Inspect &rarr; Ctrl+F or Find by selector) to quickly locate this element on the front end.</p>
                                                <div class="node__selector-body">
                                                    <pre class="node__selector-code"><code>${u.target}</code></pre>
                                                    <uui-button
                                                        compact
                                                        look="outline"
                                                        title="Copy selector"
                                                        @click=${() => navigator.clipboard.writeText(u.target)}>
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
    const t = this._collapsedPasses.has(e.id), a = this._wcagTags(e.tags);
    return s`
            <uui-box class="block-box block-box--passes${t ? " block-box--collapsed" : ""}">
                <div slot="headline" class="block-headline">
                    <span class="pass-header-label">PASSED</span>
                    <span class="block-headline__text">${e.help}</span>
                    ${a.length > 0 ? s`
                        <div class="block-headline__tags">
                            ${a.map((i) => s`<span class="tag">${i}</span>`)}
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
                        ${t ? "Expand" : "Collapse"}
                        <svg class="btn-icon chevron-icon ${t ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                    </span>
                </uui-button>

                ${t ? l : s`
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
                                <span class="btn-content">Learn more ${_}</span>
                            </uui-button>
                        </div>
                        ${e.nodes.length > 0 ? s`
                            <h5 class="nodes-heading">
                                <span>${e.nodes.length} element${e.nodes.length === 1 ? "" : "s"} checked</span>
                            </h5>
                            <div class="nodes-list">
                                ${e.nodes.map((i, r) => s`
                                    <div class="node">
                                        <div class="node__header">
                                            <span class="node__index" style="background: #27ae60; color: #fff;">${r + 1}</span>
                                            <span class="node__reasons-label">WHY THIS PASSES</span>
                                        </div>
                                        <div class="node__content">
                                            ${i.failureSummary ? s`
                                                <ul class="node__reasons-list">
                                                    ${i.failureSummary.split("; ").filter((n) => n.length > 0).map((n) => s`<li class="node__reasons-item node__reasons-item--pass">${Q}<span>${n}</span></li>`)}
                                                </ul>
                                            ` : l}
                                            <span class="node__html-label">PASSING CODE</span>
                                            <pre class="node__html"><code>${i.html}</code></pre>
                                            ${this._isSpecificSelector(i.target) ? s`
                                                <div class="node__selector">
                                                    <span class="node__selector-label">CSS SELECTOR</span>
                                                    <div class="node__selector-body">
                                                        <pre class="node__selector-code"><code>${i.target}</code></pre>
                                                        <uui-button
                                                            compact
                                                            look="outline"
                                                            title="Copy selector"
                                                            @click=${() => navigator.clipboard.writeText(i.target)}>
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
c.styles = I`
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

        .page-logo {
            width: 100px;
            height: 100px;
            flex-shrink: 0;
            object-fit: contain;
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
            justify-content: center;
            padding: var(--uui-size-layout-3);
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

        .top-row {
            display: flex;
            align-items: stretch;
            gap: var(--uui-size-space-5);
            margin-bottom: var(--uui-size-layout-1);
            flex-wrap: wrap;
        }

        /* Grade ring */

        .grade-ring {
            flex-shrink: 0;
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
        .section-heading--passes uui-button {
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
    `;
d([
  p()
], c.prototype, "_loading", 2);
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
  P("uaccessible-workspace-view")
], c);
const ae = c;
export {
  ae as default,
  c as uAccessibleWorkspaceViewElement
};
//# sourceMappingURL=workspace-view.element-C6gj0lCG.js.map
