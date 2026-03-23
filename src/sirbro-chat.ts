import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { chatTheme } from './styles/theme.js';
import type { AffiliateConfig } from './services/api.js';

import './components/chat-bubble.js';
import './components/chat-window.js';

@customElement('sirbro-chat')
export class SirBroChat extends LitElement {
  static styles = [
    chatTheme,
    css`
      :host {
        display: contents;
      }
    `,
  ];

  @property({ type: String, attribute: 'api-url' })
  apiUrl = 'https://api.tipsterbro.com/v1';

  @property({ type: String, attribute: 'brand-icon' })
  brandIcon = '';

  @property({ type: String, attribute: 'show-markdown' })
  showMarkdown = 'false';

  /* ── Partner attributes ───────────────────────────────────────── */

  @property({ type: String, attribute: 'partner-id' })
  partnerId = '';

  @property({ type: String, attribute: 'partner-logo' })
  partnerLogo = '';

  @property({ type: String, attribute: 'partner-name' })
  partnerName = '';

  /** JSON string: AffiliateConfig[] */
  @property({ type: String, attribute: 'affiliates' })
  affiliatesRaw = '';

  @property({ type: String, attribute: 'faq-link' })
  faqLink = '';

  /** Override accent colour, e.g. "#ff6b35" */
  @property({ type: String, attribute: 'accent-color' })
  accentColor = '';

  /** Widget width in px (default 400) */
  @property({ type: String, attribute: 'widget-width' })
  widgetWidth = '';

  /** Widget height in px (default 560) */
  @property({ type: String, attribute: 'widget-height' })
  widgetHeight = '';

  /* ─────────────────────────────────────────────────────────────── */

  @state() private open = false;

  private get showMarkdownEnabled(): boolean {
    return this.showMarkdown !== 'false';
  }

  private get isPartnerMode(): boolean {
    return this.partnerId.trim().length > 0;
  }

  private get affiliates(): AffiliateConfig[] {
    if (!this.affiliatesRaw) return [];
    try {
      const parsed = JSON.parse(this.affiliatesRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Apply dynamic CSS variables to the host element */
  private applyCustomVars() {
    if (this.accentColor) {
      this.style.setProperty('--sirbro-accent', this.accentColor);
    }
    if (this.widgetWidth) {
      this.style.setProperty('--sirbro-width', `${parseInt(this.widgetWidth, 10)}px`);
    }
    if (this.widgetHeight) {
      this.style.setProperty('--sirbro-height', `${parseInt(this.widgetHeight, 10)}px`);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.applyCustomVars();
  }

  protected updated(changed: Map<string, unknown>) {
    if (
      changed.has('accentColor') ||
      changed.has('widgetWidth') ||
      changed.has('widgetHeight')
    ) {
      this.applyCustomVars();
    }
  }

  private toggle() {
    this.open = !this.open;
  }

  private close() {
    this.open = false;
  }

  render() {
    return html`
      ${this.open
        ? html`
            <sirbro-chat-window
              api-url=${this.apiUrl}
              brand-icon=${this.brandIcon}
              .showMarkdown=${this.showMarkdownEnabled}
              .isPartnerMode=${this.isPartnerMode}
              partner-id=${this.partnerId}
              partner-logo=${this.partnerLogo}
              partner-name=${this.partnerName}
              .affiliates=${this.affiliates}
              faq-link=${this.faqLink}
              @close-chat=${this.close}
            ></sirbro-chat-window>
          `
        : ''}
      <sirbro-chat-bubble
        .open=${this.open}
        brand-icon=${this.brandIcon}
        @toggle-chat=${this.toggle}
      ></sirbro-chat-bubble>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sirbro-chat': SirBroChat;
  }
}
