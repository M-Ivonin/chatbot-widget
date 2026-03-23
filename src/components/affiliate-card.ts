import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { chatTheme } from '../styles/theme.js';

@customElement('sirbro-affiliate-card')
export class AffiliateCard extends LitElement {
  static styles = [
    chatTheme,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .card {
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.12) 0%,
          rgba(15, 15, 28, 0.95) 100%
        );
        overflow: hidden;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px 8px;
      }

      .casino-icon {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: var(--sirbro-accent-soft, rgba(99, 102, 241, 0.15));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--sirbro-accent, #6366f1);
      }

      .casino-icon svg {
        width: 16px;
        height: 16px;
      }

      .casino-name {
        font-size: 13px;
        font-weight: 700;
        color: var(--sirbro-text, #f0f0f5);
        flex: 1;
      }

      .live-badge {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #22c55e;
        background: rgba(34, 197, 94, 0.12);
        border: 1px solid rgba(34, 197, 94, 0.25);
        border-radius: 999px;
        padding: 2px 7px;
      }

      .bonus-block {
        margin: 0 14px 4px;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      .bonus-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
      }

      .bonus-text {
        margin-top: 4px;
        font-size: 15px;
        font-weight: 800;
        color: #fbbf24;
        line-height: 1.2;
      }

      .card-footer {
        padding: 10px 14px 14px;
      }

      .cta-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        min-height: 40px;
        padding: 10px 16px;
        border-radius: 10px;
        border: none;
        background: var(--sirbro-accent, #6366f1);
        color: #fff;
        font-family: var(--sirbro-font, system-ui, sans-serif);
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        transition: filter var(--sirbro-transition, 0.25s),
          transform var(--sirbro-transition, 0.25s);
      }

      .cta-btn:hover {
        filter: brightness(1.15);
        transform: translateY(-1px);
      }

      .cta-btn:active {
        transform: scale(0.97);
      }

      .cta-btn svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      .disclaimer {
        margin-top: 8px;
        font-size: 10px;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        text-align: center;
        line-height: 1.4;
      }
    `,
  ];

  @property({ type: String }) casino = '';
  @property({ type: String }) bonus = '';
  @property({ type: String }) url = '';

  render() {
    if (!this.url) return html``;

    return html`
      <div class="card">
        <div class="card-header">
          <div class="casino-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              ></path>
            </svg>
          </div>
          <span class="casino-name">${this.casino || 'Casino Offer'}</span>
          <span class="live-badge">Live</span>
        </div>

        ${this.bonus
          ? html`
              <div class="bonus-block">
                <div class="bonus-label">Welcome Bonus</div>
                <div class="bonus-text">${this.bonus}</div>
              </div>
            `
          : ''}

        <div class="card-footer">
          <a
            class="cta-btn"
            href=${this.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            Claim Bonus
          </a>
          <p class="disclaimer">T&amp;Cs apply. 18+. Gamble responsibly.</p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sirbro-affiliate-card': AffiliateCard;
  }
}
