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
    wcagLevel?: string | null;
    nodes: ViolationNode[];
};

type ScanHistorySummary = {
    index: number;
    scannedAt: string;
    score: number;
    grade: string;
    violationCount: number;
    criticalCount: number;
    seriousCount: number;
    moderateCount: number;
    minorCount: number;
    passingCount: number;
    hasResult: boolean;
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

function gradeCircleColor(grade: string): string {
    switch (grade) {
        case 'A': return '#27ae60';
        case 'B': return '#2ecc71';
        case 'C': return '#f39c12';
        case 'D': return '#e67e22';
        case 'F': return '#e74c3c';
        default:  return '#9ca3af';
    }
}

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
// Thinking messages — shown while scan is running
// ---------------------------------------------------------------------------

const THINKING_STEPS: Array<{ icon: string; message: string }> = [
    { icon: '🔍', message: 'Launching headless browser…' },
    { icon: '📄', message: 'Loading the published page…' },
    { icon: '🌈', message: 'Checking colour contrast ratios…' },
    { icon: '🏷️', message: 'Inspecting ARIA roles and labels…' },
    { icon: '⌨️', message: 'Evaluating keyboard navigation paths…' },
    { icon: '🖼️', message: 'Scanning for missing alternative text…' },
    { icon: '📐', message: 'Analysing heading structure and hierarchy…' },
    { icon: '🔗', message: 'Checking link names and focus indicators…' },
    { icon: '📋', message: 'Reviewing form labels and error handling…' },
    { icon: '🌍', message: 'Verifying language attributes…' },
    { icon: '📊', message: 'Auditing table structure and semantics…' },
    { icon: '✨', message: 'Tallying violations and passes…' },
];

// ---------------------------------------------------------------------------
// SVG icons
// ---------------------------------------------------------------------------

const svgExternal = html`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
    <path d="M11 13l9 -9" />
    <path d="M15 4h5v5" />
</svg>`;

const svgRotate = html`<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="1.75" viewBox="0 0 24 24">
    <path d="M21 2v6h-6"/>
    <path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>
</svg>`;

const svgStatViolation = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
</svg>`;

const svgStatPass = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`;

const svgStatReview = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
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
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
</svg>`;

const svgExclamationCircle = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    class="reason-icon">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
</svg>`;

const svgCheckCircle = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    class="reason-icon reason-icon--pass">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
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
    @state() private _scanInProgress = false;
    @state() private _thinkingIdx = 0;
    private _thinkingTimer: ReturnType<typeof setInterval> | null = null;
    @state() private _result: AuditResult | null = null;
    @state() private _error: string | null = null;
    @state() private _collapsed = new Set<string>();
    @state() private _collapsedIncomplete = new Set<string>();
    @state() private _collapsedPasses = new Set<string>();
    @state() private _activeImpact: string | null = null;
    @state() private _allCollapsed = false;
    @state() private _violationsExpanded = true;
    @state() private _reviewExpanded = true;
    @state() private _passesExpanded = false;
    @state() private _history: ScanHistorySummary[] = [];
    @state() private _historyExpanded = false;
    @state() private _historicalDate: string | null = null;
    @state() private _historyLoading: number | null = null;
    @state() private _historicalIndex: number | null = null;
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
            // If the workspace context resolved first we'll already have _unique but
            // the unauthenticated fetch will have silently failed — retry now that
            // we have a token provider.
            if (this._unique && this._history.length === 0) void this._fetchHistory();
        });

        this.consumeContext(UMB_NOTIFICATION_CONTEXT, (ctx) => {
            this._notificationContext = ctx ?? null;
        });

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (ctx) => {
            const unique = ctx?.getUnique?.();
            if (!unique) return;
            this._unique = unique;
            void this._fetchHistory();
        });
    }

    // -----------------------------------------------------------------------
    // API call
    // -----------------------------------------------------------------------

    private _startThinking() {
        this._thinkingIdx = 0;
        this._thinkingTimer = setInterval(() => {
            this._thinkingIdx = (this._thinkingIdx + 1) % THINKING_STEPS.length;
        }, 2200);
    }

    private _stopThinking() {
        if (this._thinkingTimer !== null) {
            clearInterval(this._thinkingTimer);
            this._thinkingTimer = null;
        }
    }

    private async _runAudit() {
        if (!this._unique) return;

        this._loading = true;
        this._startThinking();
        this._result  = null;
        this._error   = null;
        this._historicalDate = null;
        this._historicalIndex = null;
        this._historyExpanded = false;
        this._collapsed = new Set();
        this._collapsedIncomplete = new Set();
        this._collapsedPasses = new Set();
        this._activeImpact = null;
        this._allCollapsed = false;
        this._violationsExpanded = true;
        this._reviewExpanded = true;
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

            if (res.status === 409) {
                this._scanInProgress = true;
                this._notificationContext?.peek('warning', {
                    data: { headline: 'Scan already in progress', message: 'Another editor is already scanning this page. Check Scan history shortly for the result.' },
                });
                return;
            }
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            this._scanInProgress = false;
            this._result = await res.json();

            if (this._result && !this._result.fetchError) {
                void this._fetchHistory();
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
            this._stopThinking();
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
            this._collapsedPasses = new Set();
            this._violationsExpanded = true;
            this._reviewExpanded = true;
            this._passesExpanded = true;
            this._allCollapsed = false;
        } else {
            this._collapsed = new Set(this._result.violations.map(v => v.id));
            this._collapsedIncomplete = new Set(this._result.incomplete.map(v => v.id));
            this._collapsedPasses = new Set(this._result.passingChecks.map(v => v.id));
            this._violationsExpanded = false;
            this._reviewExpanded = false;
            this._passesExpanded = false;
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
        // Only surface success criterion numbers (e.g. wcag412 → SC 4.1.2)
        // Strip version/level tags (wcag2a, wcag21aa etc.) and category tags (cat.*)
        return tags
            .filter(t => /^wcag\d+$/.test(t))
            .map(t => {
                const digits = t.replace('wcag', '');
                if (digits.length === 3) return `SC ${digits[0]}.${digits[1]}.${digits[2]}`;
                if (digits.length === 4) return `SC ${digits[0]}.${digits[1]}.${digits.slice(2)}`;
                return `SC ${digits}`;
            });
    }

    private _wcagLevelLabel(level: string | null | undefined): string {
        if (!level) return '';
        if (level === 'Best Practice') return 'Best Practice';
        return `WCAG ${level}`;
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

    private async _fetchHistory() {
        if (!this._unique) return;
        try {
            const token = this._tokenProvider ? await this._tokenProvider() : undefined;
            const res = await fetch(`${API_BASE}/audit/history/${this._unique}`, {
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (res.ok) {
                this._history = await res.json();
                // Auto-expand on initial load (before any scan has been run)
                if (!this._result && this._history.length > 0) {
                    this._historyExpanded = true;
                }
                // Auto-load most recent result when navigating from the dashboard
                const autoloadKey = sessionStorage.getItem('uaccessible:autoload');
                if (autoloadKey === this._unique && this._history.length > 0) {
                    sessionStorage.removeItem('uaccessible:autoload');
                    void this._loadHistoryEntry(0, this._history[0].scannedAt);
                }
            } else if (res.status === 401 && !token) {
                // Auth context hadn't resolved yet — the UMB_AUTH_CONTEXT callback
                // will call us again once the token is available.
            }
        } catch {
            // history is non-critical — silently ignore network failures
        }
    }

    private async _loadHistoryEntry(index: number, scannedAt: string) {
        if (!this._unique) return;
        this._historyLoading = index;
        try {
            const token = this._tokenProvider ? await this._tokenProvider() : undefined;
            const res = await fetch(`${API_BASE}/audit/history/${this._unique}/${index}`, {
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error(`Failed to load scan (HTTP ${res.status})`);
            const loaded: AuditResult = await res.json();
            this._result = loaded;
            this._historicalDate = scannedAt;
            this._historicalIndex = index;
            this._historyExpanded = false;
            // Reset any active filter so the loaded report renders fully
            this._activeImpact = null;
            this._collapsed = new Set();
            this._collapsedIncomplete = new Set();
            this._collapsedPasses = new Set();
            this._violationsExpanded = true;
            this._reviewExpanded = true;
            this._passesExpanded = false;
            if (loaded && !loaded.fetchError) {
                this._displayScore = loaded.score;
                this._displayGrade = loaded.grade;
                this._displayColor = gradeConfig(loaded.grade);
                this._displayViolations = loaded.summary.totalViolations;
                this._displayPasses = loaded.summary.passes;
                this._displayIncomplete = loaded.summary.incompleteCount;
                this._displayRules = new Set(loaded.violations.map(v => v.id)).size;
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Could not load historical scan.';
            this._notificationContext?.peek('danger', {
                data: { headline: 'History load failed', message: msg },
            });
        } finally {
            this._historyLoading = null;
        }
    }

    private async _deleteHistoryEntry(index: number) {
        if (!this._unique) return;
        try {
            const token = this._tokenProvider ? await this._tokenProvider() : undefined;
            await fetch(`${API_BASE}/audit/history/${this._unique}/${index}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            await this._fetchHistory();
        } catch {
            // silently ignore
        }
    }

    private async _clearHistory() {
        if (!this._unique) return;
        try {
            const token = this._tokenProvider ? await this._tokenProvider() : undefined;
            await fetch(`${API_BASE}/audit/history/${this._unique}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            this._history = [];
        } catch {
            // silently ignore
        }
    }

    /** Returns score/violation delta vs the previous scan. Only shown for live (non-historical) results. */
    private _delta(): { score: number; violations: number } | null {
        if (!this._result || this._historicalDate) return null;
        const prev = this._history[1]; // [0] = current just-saved, [1] = previous
        if (!prev) return null;
        return {
            score:      (this._result.score ?? 0) - prev.score,
            violations: (this._result.summary.totalViolations ?? 0) - prev.violationCount,
        };
    }

    private _exportCsv() {
        if (!this._result) return;
        const rows = [
            ['Rule ID', 'Impact', 'WCAG Level', 'Rule Name', 'Description', 'Elements Affected', 'First Selector'],
        ];
        for (const v of this._result.violations) {
            rows.push([
                v.id,
                v.impact ?? '',
                v.wcagLevel ?? '',
                `"${v.help.replace(/"/g, '""')}"`,
                `"${v.description.replace(/"/g, '""')}"`,
                String(v.nodes.length),
                `"${(v.nodes[0]?.target ?? '').replace(/"/g, '""')}"`,
            ]);
        }
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
        a.download = `uAccessible-violations-${ts}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    private async _exportHistoryEntryCsv(index: number) {
        if (!this._unique) return;
        try {
            const token = this._tokenProvider ? await this._tokenProvider() : undefined;
            const res = await fetch(`${API_BASE}/audit/history/${this._unique}/${index}`, {
                headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });
            if (!res.ok) return;
            const result: AuditResult = await res.json();
            const rows = [
                ['Rule ID', 'Impact', 'WCAG Level', 'Rule Name', 'Description', 'Elements Affected', 'First Selector'],
            ];
            for (const v of result.violations) {
                rows.push([
                    v.id,
                    v.impact ?? '',
                    v.wcagLevel ?? '',
                    `"${v.help.replace(/"/g, '""')}"`,
                    `"${v.description.replace(/"/g, '""')}"`,
                    String(v.nodes.length),
                    `"${(v.nodes[0]?.target ?? '').replace(/"/g, '""')}"`,
                ]);
            }
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
            a.download = `uAccessible-violations-${ts}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch { /* silently ignore */ }
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    override render() {
        if (this._loading) {
            const step = THINKING_STEPS[this._thinkingIdx];
            return html`
                <div class="loader-alert-wrap">
                    <uui-alert>
                        <p>Running axe-core accessibility audit against the published version of this page — this may take a moment.</p>
                        <div class="thinking-row">
                            <span class="thinking-icon">${step.icon}</span>
                            <span class="thinking-message">${step.message}</span>
                        </div>
                        <div class="scan-progress-track" style="margin-top: 8px;"><div class="scan-progress-fill"></div></div>
                    </uui-alert>
                </div>`;
        }

        const isReady = this._result?.published && !this._result.fetchError;

        return html`
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
                    ${isReady && (this._result?.violations?.length ?? 0) > 0 ? html`
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
                    ` : nothing}
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

            ${this._scanInProgress ? html`
                <uui-alert color="warning" headline="Scan already in progress" style="margin-top: var(--uui-size-space-4);">
                    Another editor is already scanning this page. The result will appear in <strong>Scan history</strong> shortly — no need to scan again.
                </uui-alert>
            ` : nothing}

            ${this._historyLoading !== null ? html`
                <div class="history-load-bar">
                    <uui-loader-circle></uui-loader-circle>
                    <span>Loading historical scan…</span>
                </div>
            ` : nothing}

            ${this._renderBody()}
        `;
    }

    private _renderHistory() {
        if (this._history.length === 0) return nothing;
        return html`
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
                        scan${this._history.length !== 1 ? 's' : ''})
                    </span>
                    <uui-button look="outline" compact
                        @click=${() => { this._historyExpanded = !this._historyExpanded; }}>
                        <span class="btn-content">
                            ${this._historyExpanded ? 'Collapse' : 'Show'}
                            <svg class="btn-icon chevron-icon ${this._historyExpanded ? 'chevron-icon--up' : ''}"
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                </h4>
                ${this._historyExpanded ? html`
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
                                ${this._history.map((h) => html`
                                    <tr class="${h.index === 0 ? 'history-row--latest' : ''} ${this._historicalIndex === h.index ? 'history-row--active' : ''}">
                                        <td>${new Date(h.scannedAt).toLocaleString()}</td>
                                        <td><span class="grade-circle" style="color: ${gradeCircleColor(h.grade)};">${h.grade}</span></td>
                                        <td>${h.score}/100</td>
                                        <td><span class="count-badge count-badge--violations">${h.violationCount}</span></td>
                                        <td><span class="count-badge count-badge--critical">${h.criticalCount}</span></td>
                                        <td><span class="count-badge count-badge--serious">${h.seriousCount}</span></td>
                                        <td><span class="count-badge count-badge--moderate">${h.moderateCount ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--minor">${h.minorCount ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--passes">${h.passingCount ?? 0}</span></td>
                                        <td class="history-actions">
                                            <uui-button look="${this._historicalIndex === h.index ? 'primary' : 'outline'}" compact
                                                class="history-load-btn"
                                                ?disabled=${this._historyLoading === h.index}
                                                @click=${() => this._loadHistoryEntry(h.index, h.scannedAt)}>
                                                ${this._historyLoading === h.index ? html`<uui-loader-circle></uui-loader-circle>` : (this._historicalIndex === h.index ? 'Loaded' : 'Load')}
                                            </uui-button>
                                            <uui-button look="outline" compact
                                                @click=${() => this._exportHistoryEntryCsv(h.index)}
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
                                                @click=${() => this._deleteHistoryEntry(h.index)}
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
                ` : nothing}
            </div>
        `;
    }

    private _renderBody() {
        if (this._error) {
            return html`<uui-alert color="danger">${this._error}</uui-alert>`;
        }

        if (!this._result) {
            return html`
                ${this._renderHistory()}
                <uui-alert>
                    <p class="state-msg">
                        Click <strong>Run Audit</strong> to check this page for accessibility issues against its last published version.
                        ${this._history.length > 0 ? html` Or <strong>load a past scan</strong> from history above.` : nothing}
                    </p>
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
        const delta = this._delta();

        return html`
            <!-- ── Historical scan context card ── -->
            ${this._historicalDate ? html`
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
                            ${this._historicalIndex !== null ? html`
                                <span class="historical-card__meta">Entry ${this._historicalIndex + 1} of ${this._history.length} — not the latest result</span>
                            ` : nothing}
                        </div>
                        <uui-button look="primary" color="positive" compact @click=${this._runAudit}>
                            Run fresh audit
                        </uui-button>
                    </div>
                </div>
            ` : nothing}

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
                    ${delta && delta.score !== 0 ? html`
                        <span class="grade-delta ${delta.score > 0 ? 'grade-delta--up' : 'grade-delta--down'}">
                            ${delta.score > 0 ? '▲' : '▼'} ${Math.abs(delta.score)} pts
                        </span>
                    ` : nothing}
                </div>

                <!-- Stat cards -->
                <div class="stats-row">
                    <div class="stat-card stat-card--violations">
                        <div class="stat-card__icon">${svgStatViolation}</div>
                        <div class="stat-card__info">
                            <div class="stat-card__value-row">
                                <span class="stat-card__value">${this._displayViolations}</span>
                                ${delta && delta.violations !== 0 ? html`
                                    <span class="delta-badge ${delta.violations > 0 ? 'delta-badge--down' : 'delta-badge--up'}">
                                        ${delta.violations > 0 ? '▲' : '▼'}${Math.abs(delta.violations)}
                                    </span>
                                ` : nothing}
                            </div>
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
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
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
                    stroke-width="2" viewBox="0 0 24 24">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 9v4" />
                    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
                    <path d="M12 16h.01" />
                </svg>
                Accessibility violations
                <span class="section-heading-count">
                    (<strong>${violations.length}</strong>
                    violation${violations.length !== 1 ? 's' : ''} found)
                </span>
                <uui-button look="primary" compact @click=${() => { this._violationsExpanded = !this._violationsExpanded; }}>
                    <span class="btn-content">
                        ${this._violationsExpanded ? 'Collapse' : 'Show'}
                        <svg class="btn-icon chevron-icon ${this._violationsExpanded ? 'chevron-icon--up' : ''}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                    </span>
                </uui-button>
            </h4>

            ${this._violationsExpanded ? html`
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
            ` : nothing}

            <!-- ── Incomplete / needs review ── -->
            ${incomplete.length > 0 ? html`
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
                        (<strong>${incomplete.length}</strong>
                        item${incomplete.length !== 1 ? 's' : ''} require manual verification)
                    </span>
                    <uui-button look="primary" compact @click=${() => { this._reviewExpanded = !this._reviewExpanded; }}>
                        <span class="btn-content">
                            ${this._reviewExpanded ? 'Collapse' : 'Show'}
                            <svg class="btn-icon chevron-icon ${this._reviewExpanded ? 'chevron-icon--up' : ''}"
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
                ${this._reviewExpanded ? html`
                    <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                        ${incomplete.map(v => this._renderViolation(v, 'incomplete'))}
                    </div>
                ` : nothing}
            ` : nothing}

            <!-- ── Passing checks ── -->
            ${this._result.passingChecks?.length > 0 ? html`
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
                        rule${this._result.passingChecks.length !== 1 ? 's' : ''} passed)
                    </span>
                    <uui-button look="primary" compact @click=${() => { this._passesExpanded = !this._passesExpanded; }}>
                        <span class="btn-content">
                            ${this._passesExpanded ? 'Collapse' : 'Show'}
                            <svg class="btn-icon chevron-icon ${this._passesExpanded ? 'chevron-icon--up' : ''}"
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
                ${this._passesExpanded ? html`
                    <div class="violations-list" style="margin-top: var(--uui-size-space-3)">
                        ${this._result.passingChecks.map(v => this._renderPassingCheck(v))}
                    </div>
                ` : nothing}
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
                    ${(v.wcagLevel || wcagTags.length > 0) ? html`
                        <div class="block-headline__tags">
                            ${v.wcagLevel ? html`<span class="wcag-badge wcag-badge--${v.wcagLevel.toLowerCase().replace(' ', '-')}">${this._wcagLevelLabel(v.wcagLevel)}</span>` : nothing}
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
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
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
                                                ${node.failureSummary.split('; ').filter(s => s.length > 0).map(p => html`<li class="node__reasons-item" style="color: ${color};">${svgExclamationCircle}<span>${p}</span></li>`)}
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

    private _renderPassingCheck(v: ViolationDetail) {
        const isCollapsed = this._collapsedPasses.has(v.id);
        const wcagTags = this._wcagTags(v.tags);

        return html`
            <uui-box class="block-box block-box--passes${isCollapsed ? ' block-box--collapsed' : ''}">
                <div slot="headline" class="block-headline">
                    <span class="pass-header-label">PASSED</span>
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
                    @click=${() => { this._collapsedPasses = this._toggleItem(v.id, this._collapsedPasses); }}>
                    <span class="btn-content">
                        ${isCollapsed ? 'Expand' : 'Collapse'}
                        <svg class="btn-icon chevron-icon ${isCollapsed ? 'chevron-icon--up' : ''}"
                            xmlns="http://www.w3.org/2000/svg" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 9l6 6l6 -6" />
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
                        ${v.nodes.length > 0 ? html`
                            <h5 class="nodes-heading">
                                <span>${v.nodes.length} element${v.nodes.length === 1 ? '' : 's'} checked</span>
                            </h5>
                            <div class="nodes-list">
                                ${v.nodes.map((node, i) => html`
                                    <div class="node">
                                        <div class="node__header">
                                            <span class="node__index" style="background: #27ae60; color: #fff;">${i + 1}</span>
                                            <span class="node__reasons-label">WHY THIS PASSES</span>
                                        </div>
                                        <div class="node__content">
                                            ${node.failureSummary ? html`
                                                <ul class="node__reasons-list">
                                                    ${node.failureSummary.split('; ').filter(s => s.length > 0).map(p => html`<li class="node__reasons-item node__reasons-item--pass">${svgCheckCircle}<span>${p}</span></li>`)}
                                                </ul>
                                            ` : nothing}
                                            <span class="node__html-label">PASSING CODE</span>
                                            <pre class="node__html"><code>${node.html}</code></pre>
                                            ${this._isSpecificSelector(node.target) ? html`
                                                <div class="node__selector">
                                                    <span class="node__selector-label">CSS SELECTOR</span>
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
                        ` : nothing}
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
}

export default uAccessibleWorkspaceViewElement;
declare global {
    interface HTMLElementTagNameMap {
        'uaccessible-workspace-view': uAccessibleWorkspaceViewElement;
    }
}
