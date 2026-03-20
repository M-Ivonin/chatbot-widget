import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { chatTheme } from './styles/theme.js';

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

  @state() private open = false;

  private get showMarkdownEnabled(): boolean {
    return this.showMarkdown !== 'false';
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
