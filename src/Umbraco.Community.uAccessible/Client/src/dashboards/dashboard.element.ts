import {
    LitElement,
    css,
    html,
    customElement,
    state,
    nothing,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_DOCUMENT_PICKER_MODAL } from '@umbraco-cms/backoffice/document';

const API_BASE = '/umbraco/umbracommunityuaccessible/api/v1';

type PageAuditSummary = {
    key: string;
    name?: string;
    url?: string;
    score: number;
    grade: string;
    violationCount: number;
    criticalCount: number;
    seriousCount: number;
    moderateCount: number;
    minorCount: number;
    passingCount: number;
    skipped: boolean;
    skipReason?: string;
    depth: number;
    contentTypeAlias: string;
    contentTypeIcon: string;
};

type SiteAuditResult = {
    totalPages: number;
    scannedPages: number;
    skippedPages: number;
    averageScore: number;
    totalViolations: number;
    pages: PageAuditSummary[];
};

type SiteAuditHistorySummary = {
    index: number;
    scannedAt: string;
    rootName: string;
    totalPages: number;
    scannedPages: number;
    skippedPages: number;
    averageScore: number;
    totalViolations: number;
    totalCritical: number;
    totalSerious: number;
    totalModerate: number;
    totalMinor: number;
    totalPasses: number;
    hasResult: boolean;
};

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

function gradeFromScore(score: number): string {
    if (score >= 95) return 'A';
    if (score >= 80) return 'B';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

// ── Thinking messages — shown while scan is running ────────────────────────

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

// ── SVG icons ──────────────────────────────────────────────────────────────

const svgPages = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <path d="M9 13h6" /><path d="M9 17h4" />
</svg>`;

const svgScanned = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
</svg>`;

const svgScore = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <path d="M12 5v2" /><path d="M12 10v1" /><path d="M12 14v1" /><path d="M12 18v1" />
    <path d="M7 3v2" /><path d="M17 3v2" />
    <path d="M15 10.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0" />
    <path d="M6 9h1.5a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1.5" />
</svg>`;

const svgViolations = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
</svg>`;

const svgSkipped = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
</svg>`;

const svgHistory = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 8l0 4l2 2" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
</svg>`;

@customElement('uaccessible-dashboard')
export class uAccessibleDashboardElement extends UmbElementMixin(LitElement) {

    @state() private _selectedKey: string | null = null;
    @state() private _selectedName: string | null = null;
    @state() private _scanning = false;
    @state() private _scanInProgress = false;
    @state() private _thinkingIdx = 0;
    private _thinkingTimer: ReturnType<typeof setInterval> | null = null;
    @state() private _result: SiteAuditResult | null = null;
    @state() private _error: string | null = null;
    @state() private _sortBy: 'tree' | 'name' | 'score' | 'violations' = 'tree';
    @state() private _sortAsc = true;
    @state() private _resultsExpanded = true;
    @state() private _siteHistory: SiteAuditHistorySummary[] = [];
    @state() private _historyExpanded = false;
    @state() private _historyLoading: number | null = null;
    @state() private _historicalIndex: number | null = null;
    @state() private _historicalDate: string | null = null;

    private _modalManager?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
    private _tokenProvider: (() => Promise<string | null | undefined>) | null = null;

    override connectedCallback() {
        super.connectedCallback();
        this.consumeContext(UMB_AUTH_CONTEXT, (ctx) => {
            this._tokenProvider = ctx?.getOpenApiConfiguration().token ?? null;
        });
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (ctx) => {
            this._modalManager = ctx;
        });
    }

    private async _token(): Promise<Record<string, string>> {
        const token = this._tokenProvider ? await this._tokenProvider() : undefined;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async _pickContent() {
        if (!this._modalManager) return;
        const modal = this._modalManager.open(this, UMB_DOCUMENT_PICKER_MODAL, {
            data: { multiple: false, pickableFilter: () => true },
        });
        const value = await modal.onSubmit().catch(() => undefined);
        if (!value?.selection?.length) return;
        const selectedKey = value.selection[0] as unknown as string;
        if (!selectedKey) return;
        this._selectedKey = selectedKey;
        this._selectedName = selectedKey;
        this._result = null;
        this._error = null;
        this._siteHistory = [];
        this._historicalDate = null;
        this._historicalIndex = null;

        try {
            const headers = await this._token();
            const res = await fetch(`/umbraco/management/api/v1/document/${selectedKey}`, {
                headers: { Accept: 'application/json', ...headers },
            });
            if (res.ok) {
                const doc = await res.json();
                this._selectedName = doc?.variants?.[0]?.name ?? doc?.name ?? selectedKey;
            }
        } catch { /* non-critical */ }

        await this._fetchSiteHistory();
    }

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

    private async _runScan() {
        if (!this._selectedKey) return;
        this._scanning = true;
        this._startThinking();
        this._scanInProgress = false;
        this._result = null;
        this._error = null;
        this._historicalDate = null;
        this._historicalIndex = null;
        try {
            const headers = await this._token();
            const res = await fetch(`${API_BASE}/audit/tree/${this._selectedKey}`, {
                headers: { Accept: 'application/json', ...headers },
            });
            if (res.status === 409) { this._scanInProgress = true; return; }
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            this._result = await res.json();
            this._historyExpanded = false;
            await this._fetchSiteHistory();
        } catch (e: unknown) {
            this._error = e instanceof Error ? e.message : 'An unexpected error occurred.';
        } finally {
            this._stopThinking();
            this._scanning = false;
        }
    }

    private async _fetchSiteHistory() {
        if (!this._selectedKey) return;
        try {
            const headers = await this._token();
            const res = await fetch(`${API_BASE}/audit/site-history/${this._selectedKey}`, {
                headers: { Accept: 'application/json', ...headers },
            });
            if (res.ok) this._siteHistory = await res.json();
        } catch { /* non-critical */ }
    }

    private async _loadHistoryEntry(index: number, scannedAt: string) {
        if (!this._selectedKey) return;
        this._historyLoading = index;
        try {
            const headers = await this._token();
            const res = await fetch(`${API_BASE}/audit/site-history/${this._selectedKey}/${index}`, {
                headers: { Accept: 'application/json', ...headers },
            });
            if (res.status === 404) {
                this._error = 'This history entry has no stored report. It was recorded before full result storage was added. Run a new scan to capture a complete report.';
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            this._result = await res.json();
            this._historicalDate = scannedAt;
            this._historicalIndex = index;
            this._historyExpanded = false;
        } catch (e: unknown) {
            this._error = e instanceof Error ? e.message : 'Could not load historical scan.';
        } finally { this._historyLoading = null; }
    }

    private async _deleteHistoryEntry(index: number) {
        if (!this._selectedKey) return;
        try {
            const headers = await this._token();
            await fetch(`${API_BASE}/audit/site-history/${this._selectedKey}/${index}`, {
                method: 'DELETE', headers,
            });
            await this._fetchSiteHistory();
            if (this._historicalIndex === index) {
                this._result = null;
                this._historicalDate = null;
                this._historicalIndex = null;
            }
        } catch { /* silently ignore */ }
    }

    private async _clearHistory() {
        if (!this._selectedKey) return;
        try {
            const headers = await this._token();
            await fetch(`${API_BASE}/audit/site-history/${this._selectedKey}`, {
                method: 'DELETE', headers,
            });
            this._siteHistory = [];
            this._result = null;
            this._historicalDate = null;
            this._historicalIndex = null;
        } catch { /* silently ignore */ }
    }

    private _sortedPages(): PageAuditSummary[] {
        if (!this._result) return [];
        if (this._sortBy === 'tree') return this._result.pages; // preserve server tree order
        return [...this._result.pages].sort((a, b) => {
            let cmp = 0;
            if (this._sortBy === 'name')       cmp = (a.name ?? '').localeCompare(b.name ?? '');
            if (this._sortBy === 'score')      cmp = a.score - b.score;
            if (this._sortBy === 'violations') cmp = a.violationCount - b.violationCount;
            return this._sortAsc ? cmp : -cmp;
        });
    }

    private _setSort(col: 'tree' | 'name' | 'score' | 'violations') {
        if (this._sortBy === col) { this._sortAsc = !this._sortAsc; }
        else { this._sortBy = col; this._sortAsc = col === 'name'; }
    }

    /** Delta vs the scan before the current live result (index 1 after a fresh scan). */
    private _delta(): { score: number; violations: number } | null {
        if (!this._result || this._historicalDate) return null; // no delta for historical view
        const prev = this._siteHistory[1]; // [0] = just-saved current, [1] = previous
        if (!prev) return null;
        return {
            score:      Math.round(this._result.averageScore) - Math.round(prev.averageScore),
            violations: this._result.totalViolations - prev.totalViolations,
        };
    }

    private _exportCsv() {
        if (!this._result) return;
        const rows = [['Page', 'URL', 'Grade', 'Score', 'Violations', 'Critical', 'Serious', 'Status']];
        for (const p of this._result.pages) {
            rows.push([
                `"${(p.name ?? '').replace(/"/g, '""')}"`,
                `"${(p.url ?? '').replace(/"/g, '""')}"`,
                p.skipped ? '' : p.grade,
                p.skipped ? '' : String(p.score),
                p.skipped ? '' : String(p.violationCount),
                p.skipped ? '' : String(p.criticalCount),
                p.skipped ? '' : String(p.seriousCount),
                p.skipped ? `"Skipped: ${(p.skipReason ?? '').replace(/"/g, '""')}"` : 'Scanned',
            ]);
        }
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
        a.download = `uAccessible-site-audit-${ts}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    private async _exportHistoryCsv(index: number) {
        if (!this._selectedKey) return;
        try {
            const headers = await this._token();
            const res = await fetch(`${API_BASE}/audit/site-history/${this._selectedKey}/${index}`, {
                headers: { Accept: 'application/json', ...headers },
            });
            if (!res.ok) return;
            const result: SiteAuditResult = await res.json();
            const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
            const rows = [['Page', 'URL', 'Grade', 'Score', 'Violations', 'Critical', 'Serious', 'Passes', 'Status']];
            for (const p of result.pages) {
                rows.push([
                    `"${(p.name ?? '').replace(/"/g, '""')}"`,
                    `"${(p.url ?? '').replace(/"/g, '""')}"`,
                    p.skipped ? '' : p.grade,
                    p.skipped ? '' : String(p.score),
                    p.skipped ? '' : String(p.violationCount),
                    p.skipped ? '' : String(p.criticalCount),
                    p.skipped ? '' : String(p.seriousCount),
                    p.skipped ? '' : String(p.passingCount),
                    p.skipped ? `"Skipped: ${(p.skipReason ?? '').replace(/"/g, '""')}"` : 'Scanned',
                ]);
            }
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `uAccessible-site-audit-${ts}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch { /* silently ignore */ }
    }

    override updated(changedProps: Map<string, unknown>) {
        if (changedProps.has('_result') && this._result && !this._historicalDate) {
            // Animate count-up on stat values after a fresh scan
            const els = this.shadowRoot?.querySelectorAll<HTMLElement>('.count-up');
            if (!els) return;
            els.forEach(el => {
                const target = parseInt(el.dataset['target'] ?? '0', 10);
                if (isNaN(target) || target === 0) return;
                const duration = 600;
                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min((now - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
                    el.textContent = String(Math.round(target * ease));
                    if (t < 1) requestAnimationFrame(tick);
                    else el.textContent = String(target);
                };
                requestAnimationFrame(tick);
            });
        }
    }

    override render() {
        return html`
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
                        ${this._selectedKey ? html`
                            <div class="selected-node">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M9 12l2 2l4 -4" />
                                    <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z" />
                                </svg>
                                <span class="selected-node__name">${this._selectedName ?? this._selectedKey}</span>
                                <button class="selected-node__clear"
                                    @click=${() => { this._selectedKey = null; this._selectedName = null; this._result = null; this._siteHistory = []; this._historicalDate = null; this._historicalIndex = null; }}
                                    title="Clear selection">×</button>
                            </div>
                        ` : html`<span class="picker-placeholder">No content node selected</span>`}
                    </div>
                    <uui-button look="outline" @click=${this._pickContent} ?disabled=${this._scanning}>
                        Pick content node
                    </uui-button>
                    <uui-button look="primary" color="positive"
                        @click=${this._runScan}
                        ?disabled=${!this._selectedKey || this._scanning}>
                        ${this._scanning
                            ? html`<uui-loader-circle></uui-loader-circle>&nbsp;Scanning…`
                            : 'Scan subtree'}
                    </uui-button>
                </div>

                ${this._scanning ? html`
                    <uui-alert>
                        <p>Scanning all pages in sequence — this may take a while for large trees. Each page runs a full axe-core audit in a headless browser.</p>
                        <div class="thinking-row">
                            <span class="thinking-icon">${THINKING_STEPS[this._thinkingIdx].icon}</span>
                            <span class="thinking-message">${THINKING_STEPS[this._thinkingIdx].message}</span>
                        </div>
                        <div class="scan-progress-track" style="margin-top: 8px;"><div class="scan-progress-fill"></div></div>
                    </uui-alert>
                ` : nothing}

                ${this._scanInProgress ? html`
                    <uui-alert color="warning" headline="Scan already in progress">
                        Another editor is currently running a site-wide audit on this content tree. The result will appear in <strong>Scan history</strong> shortly — no need to scan again.
                    </uui-alert>
                ` : nothing}

                ${this._error ? html`<uui-alert color="danger">${this._error}</uui-alert>` : nothing}

                <!-- ── Historical context card ── -->
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
                                    <span class="historical-card__meta">Entry ${this._historicalIndex + 1} of ${this._siteHistory.length} — not the latest result</span>
                                ` : nothing}
                            </div>
                            <uui-button look="primary" color="positive" compact @click=${this._runScan} ?disabled=${this._scanning}>
                                Run fresh scan
                            </uui-button>
                        </div>
                    </div>
                ` : nothing}

                <!-- ── History card (shown whenever history exists) ── -->
                ${this._renderSiteHistory()}

                <!-- ── No result yet prompt ── -->
                ${!this._result && !this._scanning && !this._error && this._selectedKey ? html`
                    <uui-alert>
                        <p>
                            Click <strong>Scan subtree</strong> to audit all pages under this node.
                            ${this._siteHistory.length > 0 ? html` Or <strong>load a past scan</strong> from history above.` : nothing}
                        </p>
                    </uui-alert>
                ` : nothing}

                ${!this._selectedKey && !this._scanning ? html`
                    <uui-alert>
                        <p>Pick a content node above to start a site-wide accessibility audit.</p>
                    </uui-alert>
                ` : nothing}

                ${this._result ? this._renderResults() : nothing}
            </div>
        `;
    }

    private _renderSiteHistory() {
        if (!this._selectedKey || this._siteHistory.length === 0) return nothing;
        return html`
            <div class="history-section">
                <h4 class="section-heading section-heading--history">
                    ${svgHistory}
                    Scan history
                    <span class="section-heading-count">
                        (<strong>${this._siteHistory.length}</strong>
                        scan${this._siteHistory.length !== 1 ? 's' : ''})
                    </span>
                    <uui-button look="outline" compact class="history-toggle-btn"
                        @click=${() => { this._historyExpanded = !this._historyExpanded; }}>
                        <span class="btn-content">
                            ${this._historyExpanded ? 'Collapse' : 'Show'}
                            <svg class="btn-icon chevron-icon ${this._historyExpanded ? 'chevron-icon--up' : ''}"
                                xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </span>
                    </uui-button>
                </h4>
                ${this._historyExpanded ? html`
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
                                ${this._siteHistory.map((h) => html`
                                    <tr class="${h.index === 0 ? 'history-row--latest' : ''} ${this._historicalIndex === h.index ? 'history-row--active' : ''}">
                                        <td>${new Date(h.scannedAt).toLocaleString()}</td>
                                        <td>${h.scannedPages}/${h.totalPages}</td>
                                        <td><span class="grade-circle" style="color: ${gradeCircleColor(gradeFromScore(h.averageScore))};">${gradeFromScore(h.averageScore)}</span></td>
                                        <td><span class="score-val">${Math.round(h.averageScore)}/100</span></td>
                                        <td><span class="count-badge count-badge--violations">${h.totalViolations}</span></td>
                                        <td><span class="count-badge count-badge--critical">${h.totalCritical ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--serious">${h.totalSerious ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--moderate">${h.totalModerate ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--minor">${h.totalMinor ?? 0}</span></td>
                                        <td><span class="count-badge count-badge--passes">${h.totalPasses ?? 0}</span></td>
                                        <td class="history-actions">
                                            ${this._historyLoading === h.index
                                                ? html`<uui-button look="${this._historicalIndex === h.index ? 'primary' : 'outline'}" compact class="history-load-btn" title="Loading…">
                                                        <uui-loader-circle></uui-loader-circle>
                                                      </uui-button>`
                                                : (this._scanning || this._historyLoading !== null)
                                                    ? html`<span class="history-action-disabled" title="Busy — please wait">
                                                              <uui-button look="${this._historicalIndex === h.index ? 'primary' : 'outline'}" compact class="history-load-btn">
                                                                  ${this._historicalIndex === h.index ? 'Loaded' : 'Load'}
                                                              </uui-button>
                                                            </span>`
                                                    : html`<uui-button look="${this._historicalIndex === h.index ? 'primary' : 'outline'}" compact
                                                              class="history-load-btn"
                                                              @click=${() => this._loadHistoryEntry(h.index, h.scannedAt)}
                                                              title="Load this scan">
                                                              ${this._historicalIndex === h.index ? 'Loaded' : 'Load'}
                                                           </uui-button>`
                                            }
                                            <uui-button look="outline" compact
                                                @click=${() => this._exportHistoryCsv(h.index)}
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
                                                @click=${() => this._deleteHistoryEntry(h.index)}
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
                ` : nothing}
            </div>
        `;
    }

    private _renderResults() {
        const r = this._result!;
        const pages = this._sortedPages();
        const avgScore = Math.round(r.averageScore);
        const avgGrade = gradeFromScore(avgScore);
        const avgColor = { A: '#1a7a4a', B: '#1a6b2a', C: '#b7770d', D: '#d35400', F: '#c0392b' }[avgGrade] ?? '#6b7280';
        const delta = this._delta();

        return html`
            <!-- ── Stat cards ── -->
            <div class="stats-row">
                <div class="stat-card stat-card--violations">
                    <div class="stat-card__icon">${svgViolations}</div>
                    <div class="stat-card__info">
                        <div class="stat-card__value-row">
                            <span class="stat-card__value count-up" data-target="${r.totalViolations}">${r.totalViolations}</span>
                            ${delta && delta.violations !== 0 ? html`
                                <span class="delta-badge ${delta.violations > 0 ? 'delta-badge--down' : 'delta-badge--up'}">
                                    ${delta.violations > 0 ? '▲' : '▼'}${Math.abs(delta.violations)}
                                </span>
                            ` : nothing}
                        </div>
                        <span class="stat-card__label">Total violations</span>
                    </div>
                </div>
                <div class="stat-card stat-card--pages">
                    <div class="stat-card__icon">${svgPages}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value count-up" data-target="${r.totalPages}">${r.totalPages}</span>
                        <span class="stat-card__label">Pages found</span>
                    </div>
                </div>
                <div class="stat-card stat-card--scanned">
                    <div class="stat-card__icon">${svgScanned}</div>
                    <div class="stat-card__info">
                        <span class="stat-card__value count-up" data-target="${r.scannedPages}">${r.scannedPages}</span>
                        <span class="stat-card__label">Pages scanned</span>
                    </div>
                </div>
                <div class="stat-card stat-card--score" style="--score-color: ${avgColor}">
                    <div class="stat-card__icon">${svgScore}</div>
                    <div class="stat-card__info">
                        <div class="stat-card__value-row">
                            <span class="stat-card__value stat-card__value--score count-up" data-target="${avgScore}">${avgScore}</span>
                            ${delta && delta.score !== 0 ? html`
                                <span class="delta-badge ${delta.score > 0 ? 'delta-badge--up' : 'delta-badge--down'}">
                                    ${delta.score > 0 ? '▲' : '▼'}${Math.abs(delta.score)}
                                </span>
                            ` : nothing}
                        </div>
                        <span class="stat-card__label">Average score</span>
                    </div>
                </div>
                ${r.skippedPages > 0 ? html`
                    <div class="stat-card stat-card--skipped">
                        <div class="stat-card__icon">${svgSkipped}</div>
                        <div class="stat-card__info">
                            <span class="stat-card__value">${r.skippedPages}</span>
                            <span class="stat-card__label">Skipped</span>
                        </div>
                    </div>
                ` : nothing}
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
                    <span class="results-card__count">${r.scannedPages} scanned${r.skippedPages > 0 ? `, ${r.skippedPages} skipped` : ''}</span>
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
                            @click=${() => { this._resultsExpanded = !this._resultsExpanded; }}>
                            <span class="btn-content">
                                ${this._resultsExpanded ? 'Collapse' : 'Show'}
                                <svg class="btn-icon chevron-icon ${this._resultsExpanded ? 'chevron-icon--up' : ''}"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M6 9l6 6l6 -6" />
                                </svg>
                            </span>
                        </uui-button>
                    </div>
                </h4>

                ${this._resultsExpanded ? html`
                    <uui-table>
                        <uui-table-head>
                            <uui-table-head-cell class="sortable col-name" @click=${() => this._setSort('name')}>
                                Page ${this._sortBy === 'name' ? (this._sortAsc ? '↑' : '↓') : ''}
                            </uui-table-head-cell>
                            <uui-table-head-cell class="col-grade">Grade</uui-table-head-cell>
                            <uui-table-head-cell class="sortable col-score" @click=${() => this._setSort('score')}>
                                Score ${this._sortBy === 'score' ? (this._sortAsc ? '↑' : '↓') : ''}
                            </uui-table-head-cell>
                            <uui-table-head-cell class="sortable col-violations" @click=${() => this._setSort('violations')}>
                                Violations ${this._sortBy === 'violations' ? (this._sortAsc ? '↑' : '↓') : ''}
                            </uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--critical">Critical</uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--serious">Serious</uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--moderate">Moderate</uui-table-head-cell>
                            <uui-table-head-cell class="col-impact col-impact--minor">Minor</uui-table-head-cell>
                            <uui-table-head-cell class="col-passes">Passes</uui-table-head-cell>
                            <uui-table-head-cell class="col-url">URL</uui-table-head-cell>
                            <uui-table-head-cell class="col-actions"></uui-table-head-cell>
                        </uui-table-head>

                        ${pages.map(p => p.skipped ? html`
                            <uui-table-row class="row-skipped">
                                <uui-table-cell class="col-name cell-name">
                                    <div class="page-name-cell" style="padding-left: ${p.depth * 18}px">
                                        ${p.depth > 0 ? html`<svg class="tree-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 16 16"><path d="M4 2v8h9"/></svg>` : nothing}
                                        <umb-icon name="${p.contentTypeIcon}" class="doctype-icon"></umb-icon>
                                        <span class="page-node-link"
                                            @click=${() => history.pushState(null, '', `/umbraco/section/content/workspace/document/${p.key}`)}>
                                            ${p.name ?? p.key}
                                        </span>
                                        <em class="skip-reason">${p.skipReason}</em>
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
                                    <a href="/umbraco/section/content/workspace/document/edit/${p.key}/invariant/view/uaccessible" class="workspace-link-btn" title="View page results in workspace"
                                        @click=${() => sessionStorage.setItem('uaccessible:autoload', p.key)}>
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
                        ` : html`
                            <uui-table-row class="${p.criticalCount > 0 ? 'row-critical' : p.seriousCount > 0 ? 'row-serious' : ''}">
                                <uui-table-cell class="col-name cell-name">
                                    <div class="page-name-cell" style="padding-left: ${p.depth * 18}px">
                                        ${p.depth > 0 ? html`<svg class="tree-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 16 16"><path d="M4 2v8h9"/></svg>` : nothing}
                                        <umb-icon name="${p.contentTypeIcon}" class="doctype-icon"></umb-icon>
                                        <a href="/umbraco/section/content/workspace/document/${p.key}" class="page-node-link">
                                            ${p.name ?? p.key}
                                        </a>
                                    </div>
                                </uui-table-cell>
                                <uui-table-cell class="col-grade">
                                    <span class="grade-circle" style="color: ${gradeCircleColor(p.grade)};">${p.grade}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-score">
                                    <span class="score-val">${p.score}/100</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-violations">
                                    <span class="count-badge count-badge--violations">${p.violationCount}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--critical">${p.criticalCount}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--serious">${p.seriousCount}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--moderate">${p.moderateCount ?? 0}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-impact">
                                    <span class="count-badge count-badge--minor">${p.minorCount ?? 0}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-passes">
                                    <span class="count-badge count-badge--passes">${p.passingCount ?? 0}</span>
                                </uui-table-cell>
                                <uui-table-cell class="col-url">
                                    ${p.url ? html`<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="page-link">${p.url}</a>` : '—'}
                                </uui-table-cell>
                                <uui-table-cell class="col-actions">
                                    <a href="/umbraco/section/content/workspace/document/edit/${p.key}/invariant/view/uaccessible" class="workspace-link-btn" title="View page results in workspace"
                                        @click=${() => sessionStorage.setItem('uaccessible:autoload', p.key)}>
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
                ` : nothing}
            </div>
        `;
    }

    static override styles = [
        css`
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
        `,
    ];
}

export default uAccessibleDashboardElement;
declare global {
    interface HTMLElementTagNameMap {
        'uaccessible-dashboard': uAccessibleDashboardElement;
    }
}
