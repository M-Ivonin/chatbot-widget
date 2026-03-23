import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { chatTheme } from '../styles/theme.js';
import { ChatApiError, ChatApiService } from '../services/api.js';
import type { AffiliateConfig, ChatMessage, RateLimitPopupData } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { loadSessionMessages, saveSessionMessages } from '../utils/history.js';
import { IOS_STORE_URL, ANDROID_STORE_URL } from '../constants.js';

import './message-list.js';
import './message-input.js';

const GOOGLE_PLAY_ICON_PATH =
  'M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z';

const APPLE_ICON_PATH =
  'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z';

@customElement('sirbro-chat-window')
export class ChatWindow extends LitElement {
  static styles = [
    chatTheme,
    css`
      :host {
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 88px;
        right: 20px;
        width: var(--sirbro-width, 400px);
        height: var(--sirbro-height, 560px);
        max-height: calc(100vh - 110px);
        max-width: calc(100vw - 24px);
        border-radius: var(--sirbro-radius, 16px);
        background: var(--sirbro-bg, rgba(10, 10, 20, 0.85));
        backdrop-filter: blur(24px) saturate(1.4);
        -webkit-backdrop-filter: blur(24px) saturate(1.4);
        border: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
        box-shadow: var(--sirbro-shadow);
        z-index: 2147483646;
        overflow: hidden;
        animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(16px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @media (max-width: 480px) {
        :host {
          bottom: 0;
          right: 0;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-bottom: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
        background: rgba(10, 10, 20, 0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        flex-shrink: 0;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .header-avatar {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: var(--sirbro-accent-soft, rgba(99, 102, 241, 0.15));
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .header-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .partner-cobranding {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .partner-cobranding .separator {
        font-size: 12px;
        font-weight: 400;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        line-height: 1;
      }

      .partner-logo {
        width: 26px;
        height: 26px;
        border-radius: 7px;
        object-fit: cover;
        background: var(--sirbro-surface, rgba(255, 255, 255, 0.06));
      }

      .header-info h4 {
        font-size: 14px;
        font-weight: 600;
        color: var(--sirbro-text, #f0f0f5);
      }

      .header-info span {
        font-size: 11px;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .online-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        display: inline-block;
      }

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        cursor: pointer;
        transition: all var(--sirbro-transition, 0.25s);
      }

      .close-btn:hover {
        background: var(--sirbro-surface, rgba(255, 255, 255, 0.06));
        color: var(--sirbro-text, #f0f0f5);
      }

      .close-btn svg {
        width: 18px;
        height: 18px;
      }

      .chat-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      sirbro-message-list {
        flex: 1;
        overflow-y: auto;
      }

      .error-toast {
        padding: 8px 14px;
        margin: 0 16px 8px;
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.25);
        border-radius: 8px;
        color: #fca5a5;
        font-size: 12px;
        text-align: center;
        animation: fadeIn 0.3s ease;
      }

      .popup-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(10, 10, 20, 0.72);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 2;
      }

      .popup-card {
        width: 100%;
        max-width: 320px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(15, 15, 28, 0.96);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
        padding: 18px;
      }

      .popup-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--sirbro-text, #f0f0f5);
      }

      .popup-message {
        margin-top: 10px;
        color: var(--sirbro-text, #f0f0f5);
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .store-buttons {
        display: grid;
        gap: 10px;
        margin-top: 16px;
      }

      .store-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        min-height: 44px;
        padding: 12px 14px;
        border-radius: 12px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
        transition: transform var(--sirbro-transition, 0.25s), opacity var(--sirbro-transition, 0.25s);
      }

      .store-button:hover {
        transform: translateY(-1px);
        opacity: 0.95;
      }

      .store-button svg {
        width: 18px;
        height: 18px;
      }

      .store-button.play {
        background: #6366f1;
        color: white;
      }

      .store-button.apple {
        background: white;
        color: #0a0a14;
      }

      .popup-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 14px;
      }

      .popup-close {
        border: none;
        background: transparent;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
      }

      .popup-close:hover {
        color: var(--sirbro-text, #f0f0f5);
      }

      .popup-divider {
        margin: 14px 0 10px;
        border: none;
        border-top: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
      }

      .popup-sub-title {
        font-size: 12px;
        font-weight: 600;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        margin-bottom: 10px;
      }

      .affiliate-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        min-height: 44px;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--sirbro-accent, #6366f1);
        color: #fff;
        font-family: var(--sirbro-font, system-ui, sans-serif);
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        transition: filter var(--sirbro-transition, 0.25s),
          transform var(--sirbro-transition, 0.25s);
      }

      .affiliate-cta:hover {
        filter: brightness(1.12);
        transform: translateY(-1px);
      }

      .affiliate-bonus {
        margin-top: 6px;
        font-size: 12px;
        color: #fbbf24;
        font-weight: 600;
        text-align: center;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .powered-by {
        text-align: center;
        padding: 6px;
        font-size: 10px;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        border-top: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
        background: var(--sirbro-bg-solid, #0a0a14);
        flex-shrink: 0;
      }

      .powered-by a {
        color: var(--sirbro-accent, #6366f1);
        text-decoration: none;
      }

      .powered-by a:hover {
        text-decoration: underline;
      }
    `,
  ];

  @property({ type: String, attribute: 'api-url' }) apiUrl = '';
  @property({ type: String, attribute: 'brand-icon' }) brandIcon = '';
  @property({ type: Boolean }) showMarkdown = false;
  @property({ type: Array }) messages: ChatMessage[] = [];
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) error = '';

  /* ── Partner properties ───────────────────────────────────────── */
  @property({ type: Boolean }) isPartnerMode = false;
  @property({ type: String, attribute: 'partner-id' }) partnerId = '';
  @property({ type: String, attribute: 'partner-logo' }) partnerLogo = '';
  @property({ type: String, attribute: 'partner-name' }) partnerName = '';
  @property({ type: Array }) affiliates: AffiliateConfig[] = [];
  @property({ type: String, attribute: 'faq-link' }) faqLink = '';
  /* ─────────────────────────────────────────────────────────────── */

  @state() private rateLimitPopup: RateLimitPopupData | null = null;
  @state() private affiliateIndex = 0;

  private api!: ChatApiService;
  private sessionId = '';
  private browserLocale = 'en-US';

  connectedCallback() {
    super.connectedCallback();
    this.api = new ChatApiService(this.apiUrl);
    this.sessionId = getSessionId();
    this.browserLocale = this.getBrowserLocale();
    this.messages = loadSessionMessages(this.sessionId);
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('messages') && this.sessionId) {
      saveSessionMessages(this.sessionId, this.messages);
    }
  }

  private async handleSendMessage(e: CustomEvent<{ text: string }>) {
    const text = e.detail.text;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text,
      timestamp: new Date(),
    };

    this.messages = [...this.messages, userMsg];
    this.loading = true;
    this.error = '';
    this.rateLimitPopup = null;

    try {
      const responseMessages = await this.api.sendMessage(
        this.sessionId,
        text,
        this.browserLocale,
        this.partnerId || undefined,
        this.faqLink || undefined,
      );

      const assistantMessages = responseMessages.filter(
        (m) => m.role === 'assistant',
      );

      if (assistantMessages.length > 0) {
        this.messages = [...this.messages, ...assistantMessages];
      } else {
        this.messages = [
          ...this.messages,
          {
            role: 'assistant',
            text: "I've received your message but couldn't generate a response. Please try again.",
            timestamp: new Date(),
          },
        ];
      }
    } catch (err) {
      if (err instanceof ChatApiError && err.rateLimit) {
        this.rateLimitPopup = err.rateLimit;
        if (this.isPartnerMode && this.affiliates.length > 0) {
          this.affiliateIndex = (this.affiliateIndex + 1) % this.affiliates.length;
        }
        return;
      }

      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      this.error = errorMsg;
    } finally {
      this.loading = false;
    }
  }

  private close() {
    this.dispatchEvent(
      new CustomEvent('close-chat', { bubbles: true, composed: true }),
    );
  }

  private getBrowserLocale(): string {
    if (typeof navigator === 'undefined') {
      return 'en-US';
    }

    return navigator.languages?.[0] || navigator.language || 'en-US';
  }

  private closeRateLimitPopup() {
    this.rateLimitPopup = null;
  }

  private get currentAffiliate(): AffiliateConfig | null {
    if (!this.affiliates.length) return null;
    return this.affiliates[this.affiliateIndex % this.affiliates.length];
  }

  private get downloadStoreUrl(): string {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (/android/i.test(ua)) return ANDROID_STORE_URL;
    if (/iphone|ipad|ipod/i.test(ua)) return IOS_STORE_URL;
    return IOS_STORE_URL;
  }

  private renderStoreButton(type: 'play' | 'apple', href: string) {
    const label = type === 'play' ? 'Google Play' : 'App Store';
    const iconPath = type === 'play' ? GOOGLE_PLAY_ICON_PATH : APPLE_ICON_PATH;

    return html`
      <a
        class="store-button ${type}"
        href=${href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d=${iconPath}></path>
        </svg>
        <span>${label}</span>
      </a>
    `;
  }

  render() {
    return html`
      <div class="header">
        <div class="header-left">
          ${this.isPartnerMode && this.partnerLogo
            ? html`
                <div class="partner-cobranding">
                  <div class="header-avatar">
                    ${this.brandIcon
                      ? html`<img src="${this.brandIcon}" alt="SirBro" />`
                      : html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`}
                  </div>
                  <span class="separator">×</span>
                  <img class="partner-logo" src="${this.partnerLogo}" alt="${this.partnerName}" />
                </div>
              `
            : html`
                <div class="header-avatar">
                  ${this.brandIcon
                    ? html`<img src="${this.brandIcon}" alt="SirBro" />`
                    : html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`}
                </div>
              `}
          <div class="header-info">
            <h4>${this.isPartnerMode && this.partnerName ? `SirBro AI × ${this.partnerName}` : 'SirBro AI'}</h4>
            <span><span class="online-dot"></span> Always online</span>
          </div>
        </div>
        <button class="close-btn" @click=${this.close} aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="chat-body">
        <sirbro-message-list
          .messages=${this.messages}
          .loading=${this.loading}
          .showMarkdown=${this.showMarkdown}
          .locale=${this.browserLocale}
          .partnerMode=${this.isPartnerMode}
          .partnerName=${this.partnerName}
          .affiliates=${this.affiliates}
          .betUrl=${this.currentAffiliate?.url ?? ''}
          @send-message=${this.handleSendMessage}
        ></sirbro-message-list>

        ${this.error
          ? html`<div class="error-toast">${this.error}</div>`
          : ''}

        ${this.rateLimitPopup
          ? html`
              <div class="popup-overlay">
                <div class="popup-card" role="dialog" aria-modal="true">
                  <div class="popup-title">SirBro AI</div>
                  <div class="popup-message">${this.rateLimitPopup.message}</div>

                  ${this.isPartnerMode && this.currentAffiliate
                    ? html`
                        <div class="store-buttons" style="margin-top:14px">
                          <a
                            class="affiliate-cta"
                            href=${this.currentAffiliate.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >Play at ${this.currentAffiliate.casino}</a>
                          ${this.currentAffiliate.bonus
                            ? html`<div class="affiliate-bonus">${this.currentAffiliate.bonus}</div>`
                            : ''}
                        </div>
                        ${html`
                          <hr class="popup-divider" />
                          <div class="popup-sub-title">Or download the app</div>
                          <div class="store-buttons">
                            ${this.renderStoreButton('play', ANDROID_STORE_URL)}
                            ${this.renderStoreButton('apple', IOS_STORE_URL)}
                          </div>
                        `}
                      `
                    : html`
                        <div class="store-buttons">
                          ${this.rateLimitPopup.androidStoreUrl
                            ? this.renderStoreButton('play', this.rateLimitPopup.androidStoreUrl)
                            : ''}
                          ${this.rateLimitPopup.iosStoreUrl
                            ? this.renderStoreButton('apple', this.rateLimitPopup.iosStoreUrl)
                            : ''}
                        </div>
                      `}

                  <div class="popup-actions">
                    <button class="popup-close" @click=${this.closeRateLimitPopup}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            `
          : ''}

        <sirbro-message-input
          .disabled=${this.loading}
          @send-message=${this.handleSendMessage}
        ></sirbro-message-input>
      </div>

      <div class="powered-by">
        Powered by <a href="https://sirbro.com" target="_blank">SirBro</a>
      </div>
    `;
  }
}
