import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { chatTheme } from '../styles/theme.js';
import { ChatApiService } from '../services/api.js';
import type { ChatMessage } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

import './message-list.js';
import './message-input.js';

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
        width: 400px;
        height: 560px;
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
  @property({ type: Array }) messages: ChatMessage[] = [];
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) error = '';

  private api!: ChatApiService;
  private sessionId = '';

  connectedCallback() {
    super.connectedCallback();
    this.api = new ChatApiService(this.apiUrl);
    this.sessionId = getSessionId();
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

    try {
      const responseMessages = await this.api.sendMessage(this.sessionId, text);

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

  render() {
    return html`
      <div class="header">
        <div class="header-left">
          <div class="header-avatar">
            ${this.brandIcon
              ? html`<img src="${this.brandIcon}" alt="SirBro" />`
              : html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`}
          </div>
          <div class="header-info">
            <h4>SirBro AI</h4>
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
          @send-message=${this.handleSendMessage}
        ></sirbro-message-list>

        ${this.error
          ? html`<div class="error-toast">${this.error}</div>`
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
