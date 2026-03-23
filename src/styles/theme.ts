import { css } from 'lit';

export const chatTheme = css`
  :host {
    /* Core palette */
    --sirbro-bg: rgba(10, 10, 20, 0.85);
    --sirbro-bg-solid: #0a0a14;
    --sirbro-surface: rgba(255, 255, 255, 0.06);
    --sirbro-surface-hover: rgba(255, 255, 255, 0.1);
    --sirbro-border: rgba(255, 255, 255, 0.08);
    --sirbro-text: #f0f0f5;
    --sirbro-text-muted: rgba(240, 240, 245, 0.5);

    /* Accent — override with accent-color attribute or CSS variable */
    --sirbro-accent: #6366f1;
    --sirbro-accent-soft: rgba(99, 102, 241, 0.15);
    --sirbro-user-bubble: rgba(99, 102, 241, 0.2);

    --sirbro-bot-bubble: rgba(255, 255, 255, 0.05);
    --sirbro-input-bg: rgba(255, 255, 255, 0.06);

    /* Shape */
    --sirbro-radius: 16px;
    --sirbro-radius-sm: 12px;
    --sirbro-radius-xs: 8px;
    --sirbro-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);

    /* Typography — override with CSS variables on the host element */
    --sirbro-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --sirbro-font-size-base: 14px;

    /* Widget dimensions — override via widget-width / widget-height attributes */
    --sirbro-width: 400px;
    --sirbro-height: 560px;

    --sirbro-transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    font-family: var(--sirbro-font);
    font-size: var(--sirbro-font-size-base);
    line-height: 1.5;
    color: var(--sirbro-text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;
