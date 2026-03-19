import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sirbro-typing-indicator')
export class TypingIndicator extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: var(--sirbro-bot-bubble, rgba(255, 255, 255, 0.05));
      border-radius: 16px 16px 16px 4px;
      border: 1px solid var(--sirbro-border, rgba(255, 255, 255, 0.08));
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
      animation: bounce 1.4s ease-in-out infinite;
    }

    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
      }
      30% {
        transform: translateY(-6px);
        opacity: 1;
      }
    }
  `;

  render() {
    return html`
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    `;
  }
}
