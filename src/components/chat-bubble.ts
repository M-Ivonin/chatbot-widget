import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sirbro-chat-bubble')
export class ChatBubble extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483646;
    }

    .bubble-btn {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      box-shadow:
        0 4px 20px rgba(99, 102, 241, 0.35),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
    }

    .bubble-btn:hover {
      transform: scale(1.08);
      box-shadow:
        0 6px 28px rgba(99, 102, 241, 0.45),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .bubble-btn:active {
      transform: scale(0.95);
    }

    .bubble-btn.open {
      transform: rotate(0deg);
    }

    .bubble-btn img {
      width: 32px;
      height: 32px;
      object-fit: contain;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bubble-btn.open img {
      opacity: 0;
      transform: scale(0.5) rotate(90deg);
    }

    .close-icon {
      position: absolute;
      width: 24px;
      height: 24px;
      color: #fff;
      opacity: 0;
      transform: scale(0.5) rotate(-90deg);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bubble-btn.open .close-icon {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    .default-icon {
      width: 28px;
      height: 28px;
      color: #fff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bubble-btn.open .default-icon {
      opacity: 0;
      transform: scale(0.5) rotate(90deg);
    }

    /* Pulse animation when closed */
    .bubble-btn:not(.open)::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 20px;
      border: 2px solid rgba(99, 102, 241, 0.4);
      animation: pulse 2.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0;
        transform: scale(0.95);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
    }
  `;

  @property({ type: Boolean }) open = false;
  @property({ type: String, attribute: 'brand-icon' }) brandIcon = '';

  private toggle() {
    this.dispatchEvent(
      new CustomEvent('toggle-chat', { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <button
        class="bubble-btn ${this.open ? 'open' : ''}"
        @click=${this.toggle}
        aria-label="${this.open ? 'Close chat' : 'Open chat'}"
      >
        ${this.brandIcon
          ? html`<img src="${this.brandIcon}" alt="SirBro" />`
          : html`
              <svg class="default-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            `}
        <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
  }
}
