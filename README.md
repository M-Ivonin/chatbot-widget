# SirBro Chatbot Widget

Standalone embeddable AI chatbot widget built with **Lit** Web Components + **Vite**. Deployable on Vercel, integrates on any website via a single `<script>` tag.

## Quick Start

```bash
npm install
npm run dev     # Dev server at http://localhost:5173
npm run build   # Outputs dist/sirbro-chat.js
```

## Integration

Add to any website:

```html
<script src="https://sirbro-chatbot.vercel.app/sirbro-chat.js"></script>
<sirbro-chat
  api-url="https://api.tipsterbro.com/v1"
  brand-icon="https://sirbro.com/assets/brandmark.png"
></sirbro-chat>
```

### Attributes

| Attribute    | Default                              | Description                  |
|-------------|--------------------------------------|------------------------------|
| `api-url`   | `https://api.tipsterbro.com/v1`      | Backend API base URL         |
| `brand-icon`| (none)                               | URL to custom icon image     |

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
