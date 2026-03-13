import {
    LitElement,
    css,
    html,
    customElement,
    state,
    nothing,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/document';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';

// ---------------------------------------------------------------------------
// Types — mirrors C# AuditResult models
// ---------------------------------------------------------------------------

type ViolationNode = {
    html: string;
    target: string;
    failureSummary: string;
};

type ViolationDetail = {
    id: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    nodes: ViolationNode[];
};

type AuditSummary = {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    totalViolations: number;
    passes: number;
    incompleteCount: number;
};

type AuditResult = {
    url?: string;
    published: boolean;
    fetchError?: string;
    grade: string;
    score: number;
    summary: AuditSummary;
    violations: ViolationDetail[];
    incomplete: ViolationDetail[];
    passingChecks: ViolationDetail[];
};

const API_BASE = '/umbraco/umbracommunityuaccessible/api/v1';
const IMPACT_ORDER = ['critical', 'serious', 'moderate', 'minor'] as const;

// A11Y tool palette — verified ≥ 4.5:1 contrast on white
const IMPACT_COLOR: Record<string, string> = {
    critical: '#c0392b',
    serious:  '#d35400',
    moderate: '#b7770d',
    minor:    '#2471a3',
};

const IMPACT_BG: Record<string, string> = {
    critical: 'rgba(192,57,43,0.12)',
    serious:  'rgba(211,84,0,0.12)',
    moderate: 'rgba(183,119,13,0.12)',
    minor:    'rgba(36,113,163,0.10)',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gradeConfig(grade: string): { color: string; ring: string } {
    switch (grade) {
        case 'A': return { color: '#1a7a4a', ring: '#27ae60' };
        case 'B': return { color: '#1a6b2a', ring: '#2ecc71' };
        case 'C': return { color: '#b7770d', ring: '#f39c12' };
        case 'D': return { color: '#d35400', ring: '#e67e22' };
        case 'F': return { color: '#c0392b', ring: '#e74c3c' };
        default:  return { color: '#6b7280', ring: '#9ca3af' };
    }
}

function audienceFromTags(tags: string[]): string[] {
    const map: Record<string, string> = {
        'cat.color':       'Low vision',
        'cat.keyboard':    'Keyboard users',
        'cat.screen-reader': 'Screen reader users',
        'cat.structure':   'Screen reader users',
        'cat.aria':        'Assistive technology users',
        'cat.forms':       'All users',
        'cat.text-alternatives': 'Screen reader users',
        'cat.tables':      'Screen reader users',
        'cat.language':    'Screen reader users',
        'cat.time-and-media': 'Deaf / hard of hearing',
        'cat.sensory-and-visual-cues': 'Low vision',
        'cat.parsing':     'Assistive technology users',
        'cat.name-role-value': 'Assistive technology users',
        'best-practice':   'All users',
    };
    const result = new Set<string>();
    for (const tag of tags) {
        if (map[tag]) result.add(map[tag]);
    }
    return [...result];
}

function effortFor(impact: string | null): string {
    switch (impact) {
        case 'minor':    return 'Low';
        case 'moderate': return 'Medium';
        case 'serious':
        case 'critical': return 'High';
        default:         return 'Unknown';
    }
}

// ---------------------------------------------------------------------------
// SVG icons
// ---------------------------------------------------------------------------

const svgExternal = html`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

const svgRotate = html`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M21 2v6h-6"/>
    <path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>
</svg>`;

const svgStatViolation = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>`;

const svgStatPass = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
</svg>`;

const svgStatReview = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
</svg>`;

const svgStatRules = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
</svg>`;

const svgBolt = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</svg>`;

const svgExclamationCircle = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="reason-icon">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 11.66a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -7a1 1 0 0 0 -1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1" />
</svg>`;

const svgUsers = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement('uaccessible-workspace-view')
export class uAccessibleWorkspaceViewElement extends UmbElementMixin(LitElement) {

    @state() private _loading = false;
    @state() private _result: AuditResult | null = null;
    @state() private _error: string | null = null;
    @state() private _collapsed = new Set<string>();
    @state() private _collapsedIncomplete = new Set<string>();
    @state() private _activeImpact: string | null = null;
    @state() private _allCollapsed = false;
    @state() private _passesExpanded = false;
    @state() private _displayScore = 0;
    @state() private _displayGrade = '?';
    @state() private _displayColor: { color: string; ring: string } = { color: '#6b7280', ring: '#9ca3af' };
    @state() private _displayViolations = 0;
    @state() private _displayPasses = 0;
    @state() private _displayIncomplete = 0;
    @state() private _displayRules = 0;

    private _unique: string | null = null;
    private _tokenProvider: (() => Promise<string | null | undefined>) | null = null;
    private _notificationContext: typeof UMB_NOTIFICATION_CONTEXT.TYPE | null = null;

    override connectedCallback() {
        super.connectedCallback();

        this.consumeContext(UMB_AUTH_CONTEXT, (ctx) => {
            this._tokenProvider = ctx?.getOpenApiConfiguration().token ?? null;
        });

        this.consumeContext(UMB_NOTIFICATION_CONTEXT, (ctx) => {
            this._notificationContext = ctx ?? null;
        });

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (ctx) => {
            const unique = ctx?.getUnique?.();
            if (!unique) return;
            this._unique = unique;
        });
    }

    // -----------------------------------------------------------------------
    // API call
    // -----------------------------------------------------------------------

    private async _runAudit() {
        if (!this._unique) return;

        this._loading = true;
        this._result  = null;
        this._error   = null;
        this._collapsed = new Set();
        this._collapsedIncomplete = new Set();
        this._activeImpact = null;
        this._allCollapsed = false;
        this._passesExpanded = false;
        this._displayScore = 0;
        this._displayGrade = '?';
        this._displayColor = { color: '#6b7280', ring: '#9ca3af' };
        this._displayViolations = 0;
        this._displayPasses = 0;
        this._displayIncomplete = 0;
        this._displayRules = 0;

        try {
            const token = this._tokenProvider ? await this._tokenProvider() : undefined;
            const res = await fetch(`${API_BASE}/audit/key/${this._unique}`, {
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            this._result = await res.json();

            if (this._result && !this._result.fetchError) {
                this._animateScore(this._result.score ?? 0, this._result.grade);
                const v = this._result.violations.length;
                if (v === 0) {
                    this._notificationContext?.peek('positive', {
                        data: { headline: 'No violations found', message: `Grade ${this._result.grade} — all automated checks passed.` },
                    });
                } else {
                    this._notificationContext?.peek('danger', {
                        data: { headline: `${v} violation${v !== 1 ? 's' : ''} found`, message: `Grade ${this._result.grade}` },
                    });
                }
            }
        } catch (e: unknown) {
            this._error = e instanceof Error ? e.message : 'An unexpected error occurred.';
        } finally {
            this._loading = false;
        }
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private _toggleItem(id: string, set: Set<string>): Set<string> {
        const next = new Set(set);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    }

    private _toggleAll() {
        if (!this._result) return;
        if (this._allCollapsed) {
            this._collapsed = new Set();
            this._collapsedIncomplete = new Set();
            this._allCollapsed = false;
        } else {
            this._collapsed = new Set(this._result.violations.map(v => v.id));
            this._collapsedIncomplete = new Set(this._result.incomplete.map(v => v.id));
            this._allCollapsed = true;
        }
    }

    private _filteredViolations(): ViolationDetail[] {
        if (!this._result) return [];
        const all = this._result.violations;
        return this._activeImpact ? all.filter(v => v.impact === this._activeImpact) : all;
    }

    private _quickWins(): ViolationDetail[] {
        if (!this._result) return [];
        const impactOrder = ['minor', 'moderate', 'serious', 'critical'];
        return [...this._result.violations]
            .sort((a, b) => {
                const ai = impactOrder.indexOf(a.impact ?? 'minor');
                const bi = impactOrder.indexOf(b.impact ?? 'minor');
                if (ai !== bi) return ai - bi;
                return a.nodes.length - b.nodes.length;
            })
            .slice(0, 5);
    }

    private _audiences(): string[] {
        if (!this._result) return [];
        const all = new Set<string>();
        for (const v of this._result.violations) {
            for (const a of audienceFromTags(v.tags)) all.add(a);
        }
        return [...all];
    }

    private _uniqueRulesCount(): number {
        if (!this._result) return 0;
        return new Set(this._result.violations.map(v => v.id)).size;
    }

    private _wcagTags(tags: string[]): string[] {
        return tags.filter(t => t.startsWith('wcag') || t === 'best-practice');
    }

    // Returns true when the target selector is specific enough to be useful in DevTools
    // (i.e. not just a bare tag name like "h4" or "p")
    private _isSpecificSelector(target: string): boolean {
        return /[#.\s>+~\[:]/.test(target);
    }

    private _animateScore(targetScore: number, grade: string) {
        const duration = 1800;
        const start = performance.now();
        const targetColor = gradeConfig(grade);

        const GRADES = ['A', 'B', 'C', 'D', 'F'];
        const targetGradeIdx = Math.max(0, GRADES.indexOf(grade));
        const totalSteps = 25;
        const startGradeIdx = ((targetGradeIdx - totalSteps) % GRADES.length + GRADES.length) % GRADES.length;

        const targetViolations = this._result?.summary.totalViolations ?? 0;
        const targetPasses     = this._result?.summary.passes ?? 0;
        const targetIncomplete = this._result?.summary.incompleteCount ?? 0;
        const targetRules      = this._uniqueRulesCount();

        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            this._displayScore      = Math.round(eased * targetScore);
            this._displayGrade      = GRADES[(startGradeIdx + Math.floor(eased * totalSteps)) % GRADES.length];
            this._displayViolations = Math.round(eased * targetViolations);
            this._displayPasses     = Math.round(eased * targetPasses);
            this._displayIncomplete = Math.round(eased * targetIncomplete);
            this._displayRules      = Math.round(eased * targetRules);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                this._displayScore      = targetScore;
                this._displayGrade      = grade;
                this._displayColor      = targetColor;
                this._displayViolations = targetViolations;
                this._displayPasses     = targetPasses;
                this._displayIncomplete = targetIncomplete;
                this._displayRules      = targetRules;
            }
        };
        requestAnimationFrame(step);
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    override render() {
        if (this._loading) {
            return html`<div class="loader"><uui-loader></uui-loader></div>`;
        }

        const isReady = this._result?.published && !this._result.fetchError;

        return html`
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
                    ${isReady && this._result?.url ? html`
                        <uui-button look="outline"
                            href=${this._result.url}
                            target="_blank"
                            title="Open the published page in a new tab">
                            <span class="btn-content">View page ${svgExternal}</span>
                        </uui-button>
                    ` : nothing}
                    <uui-button
                        look="primary"
                        color="positive"
                        @click=${this._runAudit}
                        ?disabled=${this._loading}
                        title=${this._result ? 'Re-run accessibility audit' : 'Run accessibility audit'}>
                        <span class="btn-content">
                            ${this._result ? html`Re-run Audit ${svgRotate}` : 'Run Audit'}
                        </span>
                    </uui-button>
                </div>
            </div>

            ${this._renderBody()}
        `;
    }

    private _renderBody() {
        if (this._error) {
            return html`<uui-alert color="danger">${this._error}</uui-alert>`;
        }

        if (!this._result) {
            return html`
                <uui-alert>
                    <p class="state-msg">Click <strong>Run Audit</strong> to check this page for accessibility issues against its last published version.</p>
                    <p class="state-hint">Powered by axe-core &mdash; checks WCAG 2.0, 2.1 &amp; 2.2 (Levels A &amp; AA)</p>
                </uui-alert>
            `;
        }

        if (!this._result.published) {
            return html`
                <uui-alert headline="Page not published">
                    <p class="state-msg">This page hasn't been published yet — there is no public URL to audit.</p>
                    <p class="state-hint">Publish the page from the <strong>Info</strong> tab, then click <strong>Run Audit</strong> above.</p>
                </uui-alert>
            `;
        }

        if (this._result.fetchError) {
            return html`
                <uui-alert color="warning" headline="Could not load page">
                    <p class="state-msg">${this._result.fetchError}</p>
                    ${this._result.url ? html`
                        <div class="fetch-url-box">
                            <span class="fetch-url-label">URL attempted</span>
                            <code class="fetch-url-code">${this._result.url}</code>
                        </div>
                    ` : nothing}
                </uui-alert>
            `;
        }

        const { violations, incomplete } = this._result;
        const filtered = this._filteredViolations();
        const quickWins = this._quickWins();
        const audiences = this._audiences();

        return html`
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
                        <div class="stat-card__icon">${svgStatViolation}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayViolations}</span>
                            <span class="stat-card__label">Violations</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--passes">
                        <div class="stat-card__icon">${svgStatPass}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayPasses}</span>
                            <span class="stat-card__label">Passing</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--review">
                        <div class="stat-card__icon">${svgStatReview}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${this._displayIncomplete}</span>
                            <span class="stat-card__label">Needs Review</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--rules">
                        <div class="stat-card__icon">${svgStatRules}</div>
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
                    ${IMPACT_ORDER.map(impact => {
                        const count = violations.filter(v => v.impact === impact).length;
                        const isActive = this._activeImpact === impact;
                        const isDimmed = this._activeImpact !== null && !isActive;
                        return html`
                            <button
                                class="impact-pill impact-pill--${impact} ${isDimmed ? 'impact-pill--dimmed' : ''} ${isActive ? 'impact-pill--active' : ''}"
                                style="--pill-color: ${IMPACT_COLOR[impact]}; --pill-bg: ${IMPACT_BG[impact]}"
                                @click=${() => { this._activeImpact = isActive ? null : impact; }}
                                title="Filter by ${impact} violations">
                                ${impact.charAt(0).toUpperCase() + impact.slice(1)}: ${count}
                            </button>
                        `;
                    })}
                </div>
                ${violations.length > 0 || incomplete.length > 0 ? html`
                    <uui-button look="primary" compact @click=${this._toggleAll}>
                        <span class="btn-content">
                            ${this._allCollapsed ? 'Expand all' : 'Collapse all'}
                            <svg class="btn-icon chevron-icon ${this._allCollapsed ? 'chevron-icon--up' : ''}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </span>
                    </uui-button>
                ` : nothing}
            </div>

            ${this._activeImpact ? html`
                <p class="filter-hint">
                    Showing <strong>${this._activeImpact}</strong> violations only &mdash;
                    click the pill again to clear.
                </p>
            ` : nothing}

            <!-- ── Who is affected + Quick wins ── -->
            ${(quickWins.length > 0 || audiences.length > 0) && !this._activeImpact ? html`
                <div class="exec-row">
                    ${audiences.length > 0 ? html`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${svgUsers} Who is affected
                            </h4>
                            <p class="exec-card__subtitle">Accessibility groups impacted by violations on this page</p>
                            <div class="audience-chips">
                                ${audiences.map(a => html`
                                    <span class="audience-chip">${a}</span>
                                `)}
                            </div>
                        </div>
                    ` : nothing}

                    ${quickWins.length > 0 ? html`
                        <div class="exec-card">
                            <h4 class="exec-card__heading">
                                ${svgBolt} Quick wins
                            </h4>
                            <p class="exec-card__subtitle">Lowest effort fixes — address these first</p>
                            <ul class="quick-wins-list">
                                ${quickWins.map(v => html`
                                    <li class="quick-win">
                                        <span class="effort-badge effort-badge--${effortFor(v.impact).toLowerCase()}">
                                            ${effortFor(v.impact).toUpperCase()}
                                        </span>
                                        <span class="quick-win__text">
                                            <span class="quick-win__title">${v.help}</span>
                                            <span class="quick-win__nodes">${v.nodes.length} element${v.nodes.length !== 1 ? 's' : ''}</span>
                                        </span>
                                    </li>
                                `)}
                            </ul>
                        </div>
                    ` : nothing}
                </div>
            ` : nothing}

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
                    (<strong>${violations.length}</strong>
                    violation${violations.length !== 1 ? 's' : ''} found)
                </span>
            </h4>

            ${violations.length === 0 ? html`
                <uui-alert color="positive" headline="No violations found">
                    <p class="state-msg">This page passed all automated accessibility checks.</p>
                </uui-alert>
            ` : filtered.length === 0 ? html`
                <uui-alert>No ${this._activeImpact} violations on this page.</uui-alert>
            ` : html`
                <div class="violations-list">
                    ${filtered.map(v => this._renderViolation(v, 'violations'))}
                </div>
            `}

            <!-- ── Passing checks ── -->
            ${this._result.passingChecks?.length > 0 ? html`
                <div class="passes-section">
                    <button class="passes-toggle" @click=${() => { this._passesExpanded = !this._passesExpanded; }}>
                        <svg class="section-heading__icon passes-toggle__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.75" viewBox="0 0 24 24">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span class="passes-toggle__label">
                            Passing checks
                        </span>
                        <span class="passes-toggle__count">${this._result.passingChecks.length} rule${this._result.passingChecks.length !== 1 ? 's' : ''} passed</span>
                        <svg class="btn-icon passes-toggle__chevron ${this._passesExpanded ? 'chevron-icon--up' : ''}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    ${this._passesExpanded ? html`
                        <div class="passes-list">
                            ${this._result.passingChecks.map(v => html`
                                <div class="pass-item">
                                    <div class="pass-item__main">
                                        <svg class="pass-item__icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" viewBox="0 0 24 24">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        <div class="pass-item__body">
                                            <span class="pass-item__help">${v.help}</span>
                                            <span class="pass-item__meta">
                                                <code class="rule-id">${v.id}</code>
                                                <span class="pass-item__count">${v.nodes.length} element${v.nodes.length !== 1 ? 's' : ''} checked</span>
                                            </span>
                                        </div>
                                    </div>
                                    ${this._wcagTags(v.tags).length > 0 ? html`
                                        <div class="pass-item__tags">
                                            ${this._wcagTags(v.tags).map(tag => html`<span class="tag">${tag}</span>`)}
                                        </div>
                                    ` : nothing}
                                </div>
                            `)}
                        </div>
                    ` : nothing}
                </div>
            ` : nothing}

            <!-- ── Incomplete / needs review ── -->
            ${incomplete.length > 0 ? html`
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
                        (<strong>${incomplete.length}</strong>
                        item${incomplete.length !== 1 ? 's' : ''} require manual verification)
                    </span>
                </h4>
                <uui-alert color="warning" headline="Automated tools cannot fully determine these">
                    <p class="state-msg">These checks require a human to verify. axe-core detected a potential issue but cannot confirm whether it is a true violation.</p>
                </uui-alert>
                <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                    ${incomplete.map(v => this._renderViolation(v, 'incomplete'))}
                </div>
            ` : nothing}
        `;
    }

    private _renderViolation(v: ViolationDetail, group: 'violations' | 'incomplete') {
        const set = group === 'violations' ? this._collapsed : this._collapsedIncomplete;
        const isCollapsed = set.has(v.id);
        const wcagTags = this._wcagTags(v.tags);
        const impact = v.impact ?? 'minor';
        const color = IMPACT_COLOR[impact] ?? '#6b7280';
        const bg    = IMPACT_BG[impact]    ?? 'rgba(0,0,0,0.06)';

        return html`
            <uui-box class="block-box block-box--${impact}${isCollapsed ? ' block-box--collapsed' : ''}">
                <div slot="headline" class="block-headline">
                    <span class="impact-badge" style="--badge-color: ${color}; --badge-bg: ${bg}">
                        ${impact.charAt(0).toUpperCase() + impact.slice(1)}
                    </span>
                    <span class="block-headline__text">${v.help}</span>
                    ${wcagTags.length > 0 ? html`
                        <div class="block-headline__tags">
                            ${wcagTags.map(tag => html`<span class="tag">${tag}</span>`)}
                        </div>
                    ` : nothing}
                </div>

                <uui-button
                    slot="header-actions"
                    look="outline"
                    compact
                    @click=${() => {
                        if (group === 'violations') {
                            this._collapsed = this._toggleItem(v.id, this._collapsed);
                        } else {
                            this._collapsedIncomplete = this._toggleItem(v.id, this._collapsedIncomplete);
                        }
                    }}>
                    <span class="btn-content">
                        ${isCollapsed ? 'Expand' : 'Collapse'}
                        <svg class="btn-icon chevron-icon ${isCollapsed ? 'chevron-icon--up' : ''}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </span>
                </uui-button>

                ${!isCollapsed ? html`
                    <div class="violation-body">
                        <div class="violation-desc-row">
                            <code class="rule-id">${v.id}</code>
                            <p class="violation-description">${v.description}</p>
                            <uui-button
                                look="primary"
                                compact
                                href="${v.helpUrl}"
                                target="_blank"
                                rel="noopener noreferrer">
                                <span class="btn-content">Learn more ${svgExternal}</span>
                            </uui-button>
                        </div>

                        <h5 class="nodes-heading">
                            <span>${v.nodes.length} affected element${v.nodes.length === 1 ? '' : 's'}</span>
                        </h5>
                        <div class="nodes-list">
                            ${v.nodes.map((node, i) => html`
                                <div class="node">
                                    <div class="node__header">
                                        <span class="node__index" style="background: ${color}; color: #fff;">${i + 1}</span>
                                        ${node.failureSummary ? html`<span class="node__reasons-label">WHY THIS FAILS</span>` : nothing}
                                    </div>
                                    <div class="node__content">
                                        ${node.failureSummary ? html`
                                            <ul class="node__reasons-list">
                                                ${node.failureSummary.split('; ').filter(s => s.length > 0).map(p => html`<li class="node__reasons-item">${svgExclamationCircle}<span>${p}</span></li>`)}
                                            </ul>
                                        ` : nothing}
                                        <span class="node__html-label">IMPACTED CODE</span>
                                        <pre class="node__html"><code>${node.html}</code></pre>
                                        ${this._isSpecificSelector(node.target) ? html`
                                            <div class="node__selector">
                                                <span class="node__selector-label">CSS SELECTOR</span>
                                                <p class="node__selector-hint">Copy and paste into browser DevTools (Inspect &rarr; Ctrl+F or Find by selector) to quickly locate this element on the front end.</p>
                                                <div class="node__selector-body">
                                                    <pre class="node__selector-code"><code>${node.target}</code></pre>
                                                    <uui-button
                                                        compact
                                                        look="outline"
                                                        title="Copy selector"
                                                        @click=${() => navigator.clipboard.writeText(node.target)}>
                                                        Copy
                                                    </uui-button>
                                                </div>
                                            </div>
                                        ` : nothing}
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                ` : nothing}
            </uui-box>
        `;
    }

    // -----------------------------------------------------------------------
    // Styles
    // -----------------------------------------------------------------------

    static override styles = css`
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
}

export default uAccessibleWorkspaceViewElement;
declare global {
    interface HTMLElementTagNameMap {
        'uaccessible-workspace-view': uAccessibleWorkspaceViewElement;
    }
}
