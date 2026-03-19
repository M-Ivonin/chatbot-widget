import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('sirbro-message-input')
export class MessageInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 12px 16px;
      border-top: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
      background: var(--sirbro-bg-solid, #0a0a14);
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--sirbro-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 4px 4px 4px 16px;
      transition: border-color var(--sirbro-transition, 0.25s);
    }

    .input-wrapper:focus-within {
      border-color: var(--sirbro-accent, #6366f1);
    }

    .input-wrapper.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    textarea {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--sirbro-text, #f0f0f5);
      font-family: var(--sirbro-font, system-ui, sans-serif);
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      max-height: 100px;
      min-height: 20px;
      padding: 8px 0;
    }

    textarea::placeholder {
      color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
    }

    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      background: var(--sirbro-accent, #6366f1);
      color: #fff;
      cursor: pointer;
      transition: all var(--sirbro-transition, 0.25s);
      flex-shrink: 0;
    }

    .send-btn:hover {
      filter: brightness(1.15);
      transform: scale(1.05);
    }

    .send-btn:active {
      transform: scale(0.95);
    }

    .send-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: none;
      filter: none;
    }

    .send-btn svg {
      width: 18px;
      height: 18px;
    }
  `;

  @property({ type: Boolean }) disabled = false;

  @query('textarea') private textarea!: HTMLTextAreaElement;

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.submit();
    }
  }

  private handleInput() {
    const ta = this.textarea;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
  }

  private submit() {
    const text = this.textarea?.value?.trim();
    if (!text || this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('send-message', {
        detail: { text },
        bubbles: true,
        composed: true,
      }),
    );
    this.textarea.value = '';
    this.textarea.style.height = 'auto';
  }

  render() {
    return html`
      <div class="input-wrapper ${this.disabled ? 'disabled' : ''}">
        <textarea
          rows="1"
          placeholder="Ask SirBro anything..."
          ?disabled=${this.disabled}
          @keydown=${this.handleKeydown}
          @input=${this.handleInput}
        ></textarea>
        <button
          class="send-btn"
          ?disabled=${this.disabled || false}
          @click=${this.submit}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
  }
}
