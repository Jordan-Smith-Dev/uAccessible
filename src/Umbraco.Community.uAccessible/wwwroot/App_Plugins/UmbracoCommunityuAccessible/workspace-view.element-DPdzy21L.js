import { LitElement as E, html as s, nothing as c, css as M, state as u, customElement as P } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as R } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as T } from "@umbraco-cms/backoffice/document";
import { UMB_AUTH_CONTEXT as q } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as B } from "@umbraco-cms/backoffice/notification";
var j = Object.defineProperty, V = Object.getOwnPropertyDescriptor, d = (e, i, a, o) => {
  for (var r = o > 1 ? void 0 : o ? V(i, a) : i, l = e.length - 1, t; l >= 0; l--)
    (t = e[l]) && (r = (o ? t(i, a, r) : t(r)) || r);
  return o && r && j(i, a, r), r;
};
const O = "/umbraco/umbracommunityuaccessible/api/v1", L = ["critical", "serious", "moderate", "minor"], $ = {
  critical: "#c0392b",
  serious: "#d35400",
  moderate: "#b7770d",
  minor: "#2471a3"
}, z = {
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
function U(e) {
  const i = {
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
    i[o] && a.add(i[o]);
  return [...a];
}
function C(e) {
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
const A = s`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
</svg>`, F = s`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M21 2v6h-6"/>
    <path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>
</svg>`, D = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>`, N = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
</svg>`, W = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
</svg>`, H = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
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
    stroke-width="1.75" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</svg>`, K = s`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="reason-icon">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 11.66a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -7a1 1 0 0 0 -1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1" />
</svg>`, Q = s`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>`;
let n = class extends R(E) {
  constructor() {
    super(...arguments), this._loading = !1, this._result = null, this._error = null, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._activeImpact = null, this._allCollapsed = !1, this._passesExpanded = !1, this._displayScore = 0, this._displayGrade = "?", this._displayColor = { color: "#6b7280", ring: "#9ca3af" }, this._displayViolations = 0, this._displayPasses = 0, this._displayIncomplete = 0, this._displayRules = 0, this._unique = null, this._tokenProvider = null, this._notificationContext = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(q, (e) => {
      this._tokenProvider = (e == null ? void 0 : e.getOpenApiConfiguration().token) ?? null;
    }), this.consumeContext(B, (e) => {
      this._notificationContext = e ?? null;
    }), this.consumeContext(T, async (e) => {
      var a;
      const i = (a = e == null ? void 0 : e.getUnique) == null ? void 0 : a.call(e);
      i && (this._unique = i);
    });
  }
  // -----------------------------------------------------------------------
  // API call
  // -----------------------------------------------------------------------
  async _runAudit() {
    var e, i;
    if (this._unique) {
      this._loading = !0, this._result = null, this._error = null, this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._activeImpact = null, this._allCollapsed = !1, this._passesExpanded = !1, this._displayScore = 0, this._displayGrade = "?", this._displayColor = { color: "#6b7280", ring: "#9ca3af" }, this._displayViolations = 0, this._displayPasses = 0, this._displayIncomplete = 0, this._displayRules = 0;
      try {
        const a = this._tokenProvider ? await this._tokenProvider() : void 0, o = await fetch(`${O}/audit/key/${this._unique}`, {
          headers: {
            Accept: "application/json",
            ...a ? { Authorization: `Bearer ${a}` } : {}
          }
        });
        if (!o.ok) throw new Error(`${o.status} ${o.statusText}`);
        if (this._result = await o.json(), this._result && !this._result.fetchError) {
          this._animateScore(this._result.score ?? 0, this._result.grade);
          const r = this._result.violations.length;
          r === 0 ? (e = this._notificationContext) == null || e.peek("positive", {
            data: { headline: "No violations found", message: `Grade ${this._result.grade} — all automated checks passed.` }
          }) : (i = this._notificationContext) == null || i.peek("danger", {
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
  _toggleItem(e, i) {
    const a = new Set(i);
    return a.has(e) ? a.delete(e) : a.add(e), a;
  }
  _toggleAll() {
    this._result && (this._allCollapsed ? (this._collapsed = /* @__PURE__ */ new Set(), this._collapsedIncomplete = /* @__PURE__ */ new Set(), this._allCollapsed = !1) : (this._collapsed = new Set(this._result.violations.map((e) => e.id)), this._collapsedIncomplete = new Set(this._result.incomplete.map((e) => e.id)), this._allCollapsed = !0));
  }
  _filteredViolations() {
    if (!this._result) return [];
    const e = this._result.violations;
    return this._activeImpact ? e.filter((i) => i.impact === this._activeImpact) : e;
  }
  _quickWins() {
    if (!this._result) return [];
    const e = ["minor", "moderate", "serious", "critical"];
    return [...this._result.violations].sort((i, a) => {
      const o = e.indexOf(i.impact ?? "minor"), r = e.indexOf(a.impact ?? "minor");
      return o !== r ? o - r : i.nodes.length - a.nodes.length;
    }).slice(0, 5);
  }
  _audiences() {
    if (!this._result) return [];
    const e = /* @__PURE__ */ new Set();
    for (const i of this._result.violations)
      for (const a of U(i.tags)) e.add(a);
    return [...e];
  }
  _uniqueRulesCount() {
    return this._result ? new Set(this._result.violations.map((e) => e.id)).size : 0;
  }
  _wcagTags(e) {
    return e.filter((i) => i.startsWith("wcag") || i === "best-practice");
  }
  // Returns true when the target selector is specific enough to be useful in DevTools
  // (i.e. not just a bare tag name like "h4" or "p")
  _isSpecificSelector(e) {
    return /[#.\s>+~\[:]/.test(e);
  }
  _animateScore(e, i) {
    var b, w, y;
    const o = performance.now(), r = G(i), l = ["A", "B", "C", "D", "F"], t = Math.max(0, l.indexOf(i)), g = 25, p = ((t - g) % l.length + l.length) % l.length, v = ((b = this._result) == null ? void 0 : b.summary.totalViolations) ?? 0, h = ((w = this._result) == null ? void 0 : w.summary.passes) ?? 0, _ = ((y = this._result) == null ? void 0 : y.summary.incompleteCount) ?? 0, x = this._uniqueRulesCount(), m = (S) => {
      const I = S - o, k = Math.min(I / 1800, 1), f = 1 - Math.pow(1 - k, 3);
      this._displayScore = Math.round(f * e), this._displayGrade = l[(p + Math.floor(f * g)) % l.length], this._displayViolations = Math.round(f * v), this._displayPasses = Math.round(f * h), this._displayIncomplete = Math.round(f * _), this._displayRules = Math.round(f * x), k < 1 ? requestAnimationFrame(m) : (this._displayScore = e, this._displayGrade = i, this._displayColor = r, this._displayViolations = v, this._displayPasses = h, this._displayIncomplete = _, this._displayRules = x);
    };
    requestAnimationFrame(m);
  }
  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  render() {
    var i, a;
    if (this._loading)
      return s`<div class="loader"><uui-loader></uui-loader></div>`;
    const e = ((i = this._result) == null ? void 0 : i.published) && !this._result.fetchError;
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
                            <span class="btn-content">View page ${A}</span>
                        </uui-button>
                    ` : c}
                    <uui-button
                        look="primary"
                        color="positive"
                        @click=${this._runAudit}
                        ?disabled=${this._loading}
                        title=${this._result ? "Re-run accessibility audit" : "Run accessibility audit"}>
                        <span class="btn-content">
                            ${this._result ? s`Re-run Audit ${F}` : "Run Audit"}
                        </span>
                    </uui-button>
                </div>
            </div>

            ${this._renderBody()}
        `;
  }
  _renderBody() {
    var l;
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
                    ` : c}
                </uui-alert>
            `;
    const { violations: e, incomplete: i } = this._result, a = this._filteredViolations(), o = this._quickWins(), r = this._audiences();
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
                        <div class="stat-card__icon">${N}</div>
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
                        <div class="stat-card__icon">${H}</div>
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
                    ${L.map((t) => {
      const g = e.filter((h) => h.impact === t).length, p = this._activeImpact === t, v = this._activeImpact !== null && !p;
      return s`
                            <button
                                class="impact-pill impact-pill--${t} ${v ? "impact-pill--dimmed" : ""} ${p ? "impact-pill--active" : ""}"
                                style="--pill-color: ${$[t]}; --pill-bg: ${z[t]}"
                                @click=${() => {
        this._activeImpact = p ? null : t;
      }}
                                title="Filter by ${t} violations">
                                ${t.charAt(0).toUpperCase() + t.slice(1)}: ${g}
                            </button>
                        `;
    })}
                </div>
                ${e.length > 0 || i.length > 0 ? s`
                    <uui-button look="primary" compact @click=${this._toggleAll}>
                        <span class="btn-content">
                            ${this._allCollapsed ? "Expand all" : "Collapse all"}
                            <svg class="btn-icon chevron-icon ${this._allCollapsed ? "chevron-icon--up" : ""}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </span>
                    </uui-button>
                ` : c}
            </div>

            ${this._activeImpact ? s`
                <p class="filter-hint">
                    Showing <strong>${this._activeImpact}</strong> violations only &mdash;
                    click the pill again to clear.
                </p>
            ` : c}

            <!-- ── Who is affected + Quick wins ── -->
            ${(o.length > 0 || r.length > 0) && !this._activeImpact ? s`
                <div class="exec-row">
                    ${r.length > 0 ? s`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${Q} Who is affected
                            </h4>
                            <p class="exec-card__subtitle">Accessibility groups impacted by violations on this page</p>
                            <div class="audience-chips">
                                ${r.map((t) => s`
                                    <span class="audience-chip">${t}</span>
                                `)}
                            </div>
                        </div>
                    ` : c}

                    ${o.length > 0 ? s`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${X} Quick wins
                            </h4>
                            <p class="exec-card__subtitle">Lowest effort fixes — address these first</p>
                            <ul class="quick-wins-list">
                                ${o.map((t) => s`
                                    <li class="quick-win">
                                        <span class="effort-badge effort-badge--${C(t.impact).toLowerCase()}">
                                            ${C(t.impact).toUpperCase()}
                                        </span>
                                        <span class="quick-win__text">
                                            <span class="quick-win__title">${t.help}</span>
                                            <span class="quick-win__nodes">${t.nodes.length} element${t.nodes.length !== 1 ? "s" : ""}</span>
                                        </span>
                                    </li>
                                `)}
                            </ul>
                        </div>
                    ` : c}
                </div>
            ` : c}

            <!-- ── Violations ── -->
            <h4 class="section-heading section-heading--violations">
                <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.75" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Accessibility violations
                <span class="section-heading-count">
                    (<strong>${e.length}</strong>
                    violation${e.length !== 1 ? "s" : ""} found)
                </span>
            </h4>

            ${e.length === 0 ? s`
                <uui-alert color="positive" headline="No violations found">
                    <p class="state-msg">This page passed all automated accessibility checks.</p>
                </uui-alert>
            ` : a.length === 0 ? s`
                <uui-alert>No ${this._activeImpact} violations on this page.</uui-alert>
            ` : s`
                <div class="violations-list">
                    ${a.map((t) => this._renderViolation(t, "violations"))}
                </div>
            `}

            <!-- ── Passing checks ── -->
            ${((l = this._result.passingChecks) == null ? void 0 : l.length) > 0 ? s`
                <div class="passes-section">
                    <button class="passes-toggle" @click=${() => {
      this._passesExpanded = !this._passesExpanded;
    }}>
                        <svg class="section-heading__icon passes-toggle__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.75" viewBox="0 0 24 24">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span class="passes-toggle__label">
                            Passing checks
                        </span>
                        <span class="passes-toggle__count">${this._result.passingChecks.length} rule${this._result.passingChecks.length !== 1 ? "s" : ""} passed</span>
                        <svg class="btn-icon passes-toggle__chevron ${this._passesExpanded ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    ${this._passesExpanded ? s`
                        <div class="passes-list">
                            ${this._result.passingChecks.map((t) => s`
                                <div class="pass-item">
                                    <div class="pass-item__main">
                                        <svg class="pass-item__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" viewBox="0 0 24 24">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        <div class="pass-item__body">
                                            <span class="pass-item__help">${t.help}</span>
                                            <span class="pass-item__meta">
                                                <code class="rule-id">${t.id}</code>
                                                <span class="pass-item__count">${t.nodes.length} element${t.nodes.length !== 1 ? "s" : ""} checked</span>
                                            </span>
                                        </div>
                                    </div>
                                    ${this._wcagTags(t.tags).length > 0 ? s`
                                        <div class="pass-item__tags">
                                            ${this._wcagTags(t.tags).map((g) => s`<span class="tag">${g}</span>`)}
                                        </div>
                                    ` : c}
                                </div>
                            `)}
                        </div>
                    ` : c}
                </div>
            ` : c}

            <!-- ── Incomplete / needs review ── -->
            ${i.length > 0 ? s`
                <h4 class="section-heading section-heading--review" style="margin-top: var(--uui-size-layout-1)">
                    <svg class="section-heading__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="1.75" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Needs manual review
                    <span class="section-heading-count">
                        (<strong>${i.length}</strong>
                        item${i.length !== 1 ? "s" : ""} require manual verification)
                    </span>
                </h4>
                <uui-alert color="warning" headline="Automated tools cannot fully determine these">
                    <p class="state-msg">These checks require a human to verify. axe-core detected a potential issue but cannot confirm whether it is a true violation.</p>
                </uui-alert>
                <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                    ${i.map((t) => this._renderViolation(t, "incomplete"))}
                </div>
            ` : c}
        `;
  }
  _renderViolation(e, i) {
    const o = (i === "violations" ? this._collapsed : this._collapsedIncomplete).has(e.id), r = this._wcagTags(e.tags), l = e.impact ?? "minor", t = $[l] ?? "#6b7280", g = z[l] ?? "rgba(0,0,0,0.06)";
    return s`
            <uui-box class="block-box block-box--${l}${o ? " block-box--collapsed" : ""}">
                <div slot="headline" class="block-headline">
                    <span class="impact-badge" style="--badge-color: ${t}; --badge-bg: ${g}">
                        ${l.charAt(0).toUpperCase() + l.slice(1)}
                    </span>
                    <span class="block-headline__text">${e.help}</span>
                    ${r.length > 0 ? s`
                        <div class="block-headline__tags">
                            ${r.map((p) => s`<span class="tag">${p}</span>`)}
                        </div>
                    ` : c}
                </div>

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => {
      i === "violations" ? this._collapsed = this._toggleItem(e.id, this._collapsed) : this._collapsedIncomplete = this._toggleItem(e.id, this._collapsedIncomplete);
    }}>
                    <span class="btn-content">
                        ${o ? "Expand" : "Collapse"}
                        <svg class="btn-icon chevron-icon ${o ? "chevron-icon--up" : ""}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </span>
                </uui-button>

                ${o ? c : s`
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
                                <span class="btn-content">Learn more ${A}</span>
                            </uui-button>
                        </div>

                        <h5 class="nodes-heading">
                            <span>${e.nodes.length} affected element${e.nodes.length === 1 ? "" : "s"}</span>
                        </h5>
                        <div class="nodes-list">
                            ${e.nodes.map((p, v) => s`
                                <div class="node">
                                    <div class="node__header">
                                        <span class="node__index" style="background: ${t}; color: #fff;">${v + 1}</span>
                                        ${p.failureSummary ? s`<span class="node__reasons-label">WHY THIS FAILS</span>` : c}
                                    </div>
                                    <div class="node__content">
                                        ${p.failureSummary ? s`
                                            <ul class="node__reasons-list">
                                                ${p.failureSummary.split("; ").filter((h) => h.length > 0).map((h) => s`<li class="node__reasons-item">${K}<span>${h}</span></li>`)}
                                            </ul>
                                        ` : c}
                                        <span class="node__html-label">IMPACTED CODE</span>
                                        <pre class="node__html"><code>${p.html}</code></pre>
                                        ${this._isSpecificSelector(p.target) ? s`
                                            <div class="node__selector">
                                                <span class="node__selector-label">CSS SELECTOR</span>
                                                <p class="node__selector-hint">Copy and paste into browser DevTools (Inspect &rarr; Ctrl+F or Find by selector) to quickly locate this element on the front end.</p>
                                                <div class="node__selector-body">
                                                    <pre class="node__selector-code"><code>${p.target}</code></pre>
                                                    <uui-button
                                                        compact
                                                        look="outline"
                                                        title="Copy selector"
                                                        @click=${() => navigator.clipboard.writeText(p.target)}>
                                                        Copy
                                                    </uui-button>
                                                </div>
                                            </div>
                                        ` : c}
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                `}
            </uui-box>
        `;
  }
};
n.styles = M`
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
            color: #922b21;
            line-height: 1.4;
        }

        .reason-icon {
            flex-shrink: 0;
            width: 15px;
            height: 15px;
            margin-top: 1px;
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

        .passes-section {
            margin: var(--uui-size-layout-1) 0;
        }

        .passes-toggle {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            width: 100%;
            padding: var(--uui-size-space-3) var(--uui-size-space-4);
            background: color-mix(in srgb, #27ae60 8%, transparent);
            border: 1px solid color-mix(in srgb, #27ae60 30%, transparent);
            border-radius: var(--uui-border-radius, 3px);
            cursor: pointer;
            font-family: inherit;
            text-align: left;
            transition: background 0.15s ease;
        }

        .passes-toggle:hover {
            background: color-mix(in srgb, #27ae60 14%, transparent);
        }

        .passes-toggle__icon {
            color: #1a7a4a;
        }

        .passes-toggle__chevron {
            color: #1a7a4a;
            flex-shrink: 0;
            transition: transform 0.2s ease;
        }

        .passes-toggle__label {
            font-size: 15px;
            font-weight: 700;
            color: #1a7a4a;
            flex: 1;
        }

        .passes-toggle__count {
            font-size: 12px;
            font-weight: 700;
            color: #1a7a4a;
            background: color-mix(in srgb, #27ae60 18%, transparent);
            padding: 2px 10px;
            border-radius: 99px;
        }

        .passes-list {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-2);
            margin-top: var(--uui-size-space-2);
        }

        .pass-item {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-2);
            padding: var(--uui-size-space-3) var(--uui-size-space-4);
            background: var(--uui-color-surface, #fff);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            border-radius: var(--uui-border-radius, 3px);
            border-left: 3px solid #27ae60;
        }

        .pass-item__main {
            display: flex;
            align-items: flex-start;
            gap: var(--uui-size-space-3);
        }

        .pass-item__icon {
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            color: #27ae60;
            margin-top: 1px;
        }

        .pass-item__body {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }

        .pass-item__help {
            font-size: 13px;
            color: var(--uui-color-text, #1a1a1a);
            line-height: 1.4;
        }

        .pass-item__meta {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-2);
            flex-wrap: wrap;
        }

        .pass-item__count {
            font-size: 11px;
            color: var(--uui-color-text-alt, #6b7280);
        }

        .pass-item__tags {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-1);
            flex-wrap: wrap;
            padding-left: calc(16px + var(--uui-size-space-3));
        }
    `;
d([
  u()
], n.prototype, "_loading", 2);
d([
  u()
], n.prototype, "_result", 2);
d([
  u()
], n.prototype, "_error", 2);
d([
  u()
], n.prototype, "_collapsed", 2);
d([
  u()
], n.prototype, "_collapsedIncomplete", 2);
d([
  u()
], n.prototype, "_activeImpact", 2);
d([
  u()
], n.prototype, "_allCollapsed", 2);
d([
  u()
], n.prototype, "_passesExpanded", 2);
d([
  u()
], n.prototype, "_displayScore", 2);
d([
  u()
], n.prototype, "_displayGrade", 2);
d([
  u()
], n.prototype, "_displayColor", 2);
d([
  u()
], n.prototype, "_displayViolations", 2);
d([
  u()
], n.prototype, "_displayPasses", 2);
d([
  u()
], n.prototype, "_displayIncomplete", 2);
d([
  u()
], n.prototype, "_displayRules", 2);
n = d([
  P("uaccessible-workspace-view")
], n);
const ie = n;
export {
  ie as default,
  n as uAccessibleWorkspaceViewElement
};
//# sourceMappingURL=workspace-view.element-DPdzy21L.js.map
