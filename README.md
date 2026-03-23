# SirBro Chatbot Widget

Standalone embeddable AI chatbot widget built with **Lit** Web Components + **Vite**. Deployable on Vercel, integrates on any website via a single `<script>` tag.

## Quick Start

```bash
npm install
npm run dev     # Dev server at http://localhost:5173
npm run build   # Outputs dist/sirbro-chat.js
```

## Integration

### SirBro.com Version

```html
<script src="https://sirbro-chatbot.vercel.app/sirbro-chat.js"></script>
<sirbro-chat
  api-url="https://api.tipsterbro.com/v1"
  brand-icon="https://sirbro.com/assets/brandmark.png"
></sirbro-chat>
```

### Partners Version

Partner mode is **auto-detected** when the `partner-id` attribute is present.

```html
<script src="https://sirbro-chatbot.vercel.app/sirbro-chat.js"></script>
<sirbro-chat
  api-url="https://api.tipsterbro.com/v1"
  brand-icon="https://sirbro.com/assets/brandmark.png"
  partner-id="casino-brand-123"
  partner-logo="https://partner.com/logo.png"
  partner-name="CasinoBrand"
  affiliates='[
    {"casino":"CasinoBrand","url":"https://casino.com/ref=123","bonus":"100% up to €200"},
    {"casino":"BetKing","url":"https://betking.com/ref=abc","bonus":"50 free spins"},
    {"casino":"SpinCity","url":"https://spincity.com/ref=xyz","bonus":"€100 no-deposit"}
  ]'
  accent-color="#ff6b35"
  widget-width="420"
  widget-height="600"
></sirbro-chat>
```

### All Attributes

| Attribute          | Default                         | Description                                                     |
|-------------------|---------------------------------|-----------------------------------------------------------------|
| `api-url`         | `https://api.tipsterbro.com/v1` | Backend API base URL (optional, defaults to production)         |
| `brand-icon`      | (none)                          | URL to SirBro icon image                                        |
| `show-markdown`   | `false`                         | Render bot responses as markdown (SirBro mode)                   |
| `partner-id`      | (none)                          | **Enables partner mode** when set; sent to backend               |
| `partner-logo`    | (none)                          | Partner brand logo URL for co-branded header                     |
| `partner-name`    | (none)                          | Partner name shown in header and welcome screen                  |
| `affiliates`      | (none)                          | JSON array of `{casino, url, bonus}` affiliate configs          |
| `accent-color`    | `#6366f1`                       | Override primary accent colour (hex / rgb)                      |
| `widget-width`    | `400`                           | Widget width in px                                              |
| `widget-height`   | `560`                           | Widget height in px                                             |

### CSS Variable Customisation

Override any design token on the `<sirbro-chat>` host element:

```css
sirbro-chat {
  --sirbro-accent: #ff6b35;          /* Primary accent colour */
  --sirbro-bg: rgba(5, 5, 10, 0.9); /* Chat window background */
  --sirbro-font: 'Inter', sans-serif; /* Font family */
  --sirbro-font-size-base: 15px;     /* Base font size */
  --sirbro-width: 420px;             /* Widget width */
  --sirbro-height: 620px;            /* Widget height */
  --sirbro-radius: 20px;             /* Border radius */
}
```

## Architecture

- **Web Component** with Shadow DOM (full style isolation)
- **Lit 3** (~5 KB) for reactive templating
- **IIFE bundle** — no framework dependencies leaked to host page
- Guest session via `localStorage` UUID
- Backend: `POST /v1/chat/guest-message` (no auth required)

## Deployment

Deployed to Vercel as a static site. The `vercel.json` configures CORS headers for the JS bundle.

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

## Project Structure

```
src/
├── sirbro-chat.ts          # Main <sirbro-chat> entry component
├── components/
│   ├── chat-bubble.ts      # Floating icon button (bottom-right)
│   ├── chat-window.ts      # Chat panel with glassmorphism
│   ├── message-list.ts     # Message rendering + welcome screen
│   ├── message-input.ts    # Text input + send button
│   └── typing-indicator.ts # Animated dots while bot responds
├── services/
│   └── api.ts              # HTTP client for backend
├── utils/
│   └── session.ts          # localStorage session ID
└── styles/
    └── theme.ts            # CSS design tokens
```
