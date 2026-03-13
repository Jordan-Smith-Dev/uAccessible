import {
    LitElement,
    css,
    html,
    customElement,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

@customElement('uaccessible-dashboard')
export class uAccessibleDashboardElement extends UmbElementMixin(LitElement) {

    static override styles = [
        css`
            :host {
                display: block;
                padding: var(--uui-size-layout-1);
            }
            .intro {
                display: flex;
                flex-direction: column;
                gap: var(--uui-size-space-4);
            }
            h2 {
                margin: 0;
                font-size: var(--uui-type-large-size, 18px);
                font-weight: 700;
                color: var(--uui-color-text);
            }
            p {
                margin: 0;
                color: var(--uui-color-text-alt);
            }
        `,
    ];

    override render() {
        return html`
            <uui-box>
                <div class="intro">
                    <h2>uAccessible</h2>
                    <p>
                        Open any content page and click the <strong>Accessibility</strong> tab
                        to run an audit against its last published version.
                    </p>
                    <p>
                        Reports are powered by axe-core and check against WCAG 2.0, 2.1, and 2.2
                        criteria (Levels A &amp; AA).
                    </p>
                </div>
            </uui-box>
        `;
    }
}

export default uAccessibleDashboardElement;
declare global {
    interface HTMLElementTagNameMap {
        'uaccessible-dashboard': uAccessibleDashboardElement;
    }
}
