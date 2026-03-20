import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { ChatMessage } from '../services/api.js';

import './typing-indicator.js';
import './prediction-card.js';

function renderMarkdown(text: string): string {
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Convert line breaks
  const lines = result.split('\n');
  const processed: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Unordered list items
    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        processed.push('<ul>');
        inList = true;
      }
      processed.push(`<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`);
      continue;
    }

    // Ordered list items
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList) {
        processed.push('<ol>');
        inList = true;
      }
      processed.push(`<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`);
      continue;
    }

    if (inList) {
      processed.push(processed[processed.length - 1]?.startsWith('<ol>') ? '</ol>' : '</ul>');
      inList = false;
    }

    if (trimmed === '') {
      processed.push('<br/>');
    } else {
      processed.push(`<span>${line}</span>`);
    }
  }

  if (inList) {
    processed.push('</ul>');
  }

  return processed.join('');
}

@customElement('sirbro-message-list')
export class MessageList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      gap: 12px;
      scroll-behavior: smooth;
    }

    :host::-webkit-scrollbar {
      width: 4px;
    }

    :host::-webkit-scrollbar-track {
      background: transparent;
    }

    :host::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .message {
      display: flex;
      flex-direction: column;
      max-width: 85%;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.user {
      align-self: flex-end;
    }

    .message.assistant {
      align-self: flex-start;
    }

    .bubble {
      padding: 10px 14px;
      border-radius: 16px;
      line-height: 1.55;
      word-break: break-word;
    }

    .user .bubble {
      background: var(--sirbro-user-bubble, rgba(99, 102, 241, 0.2));
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 16px 16px 4px 16px;
      color: var(--sirbro-text, #f0f0f5);
    }

    .assistant .bubble {
      background: var(--sirbro-bot-bubble, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
      border-radius: 16px 16px 16px 4px;
      color: var(--sirbro-text, #f0f0f5);
    }

    .bubble strong {
      font-weight: 600;
    }

    .bubble em {
      font-style: italic;
    }

    .bubble code {
      background: rgba(255, 255, 255, 0.08);
      padding: 1px 5px;
      border-radius: 4px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.9em;
    }

    .bubble a {
      color: var(--sirbro-accent, #6366f1);
      text-decoration: none;
    }

    .bubble a:hover {
      text-decoration: underline;
    }

    .bubble ul, .bubble ol {
      padding-left: 18px;
      margin: 4px 0;
    }

    .bubble li {
      margin: 2px 0;
    }

    .bubble br {
      display: block;
      content: "";
      margin-top: 6px;
    }

    .timestamp {
      font-size: 11px;
      color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
      margin-top: 4px;
      padding: 0 4px;
    }

    .user .timestamp {
      text-align: right;
    }

    .typing-row {
      align-self: flex-start;
      animation: fadeIn 0.3s ease;
    }

    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 32px 16px;
      gap: 12px;
      flex: 1;
    }

    .welcome-icon {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: var(--sirbro-accent-soft, rgba(99, 102, 241, 0.15));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .welcome-icon svg {
      width: 24px;
      height: 24px;
      color: var(--sirbro-accent, #6366f1);
    }

    .welcome h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--sirbro-text, #f0f0f5);
    }

    .welcome p {
      font-size: 13px;
      color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
      max-width: 260px;
      line-height: 1.5;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: 8px;
    }

    .suggestion-chip {
      padding: 8px 14px;
      border-radius: 20px;
      border: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
      background: var(--sirbro-surface, rgba(255, 255, 255, 0.06));
      color: var(--sirbro-text, #f0f0f5);
      font-size: 12px;
      cursor: pointer;
      transition: all var(--sirbro-transition, 0.25s);
      font-family: var(--sirbro-font, system-ui, sans-serif);
    }

    .suggestion-chip:hover {
      background: var(--sirbro-surface-hover, rgba(255, 255, 255, 0.1));
      border-color: var(--sirbro-accent, #6366f1);
    }
  `;

  @property({ type: Array }) messages: ChatMessage[] = [];
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) showMarkdown = true;
  @property({ type: String }) locale = 'en-US';

  private suggestions = [
    'What is SirBro?',
    'How do AI predictions work?',
    'What plans are available?',
  ];

  private handleSuggestionClick(text: string) {
    this.dispatchEvent(
      new CustomEvent('send-message', {
        detail: { text },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('messages') || changed.has('loading')) {
      requestAnimationFrame(() => {
        this.scrollTop = this.scrollHeight;
      });
    }
  }

  private formatTime(date: Date): string {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private shouldRenderPredictionCard(msg: ChatMessage): boolean {
    return (
      !this.showMarkdown &&
      msg.role === 'assistant' &&
      msg.messageType === 'prediction' &&
      !!msg.content &&
      typeof msg.content['eventName'] === 'string' &&
      typeof msg.content['predictionValue'] === 'string'
    );
  }

  render() {
    if (this.messages.length === 0 && !this.loading) {
      return html`
        <div class="welcome">
          <div class="welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>Hi! I'm SirBro AI</h3>
          <p>Your intelligent sports betting assistant. Ask me anything about predictions, tips, or how SirBro works.</p>
          <div class="suggestions">
            ${this.suggestions.map(
              (s) => html`
                <button
                  class="suggestion-chip"
                  @click=${() => this.handleSuggestionClick(s)}
                >
                  ${s}
                </button>
              `,
            )}
          </div>
        </div>
      `;
    }

    return html`
      ${this.messages.map(
        (msg) => html`
          <div class="message ${msg.role}">
            ${this.shouldRenderPredictionCard(msg)
              ? html`
                  <sirbro-prediction-card
                    .content=${msg.content ?? null}
                    .locale=${this.locale}
                  ></sirbro-prediction-card>
                `
              : html`
                  <div class="bubble">
                    ${msg.role === 'assistant'
                      ? unsafeHTML(renderMarkdown(msg.text))
                      : msg.text}
                  </div>
                `}
            <span class="timestamp">${this.formatTime(msg.timestamp)}</span>
          </div>
        `,
      )}
      ${this.loading
        ? html`<div class="typing-row"><sirbro-typing-indicator></sirbro-typing-indicator></div>`
        : ''}
    `;
  }
}
