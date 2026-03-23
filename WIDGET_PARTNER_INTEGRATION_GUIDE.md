# SirBro Chatbot Widget — Partner Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [How Partner Mode Works](#how-partner-mode-works)
4. [Widget Attributes Reference](#widget-attributes-reference)
5. [Affiliate Links Configuration](#affiliate-links-configuration)
6. [Style Customisation](#style-customisation)
7. [Partner Onboarding Checklist](#partner-onboarding-checklist)
8. [UI Behaviour in Partner Mode](#ui-behaviour-in-partner-mode)
9. [Rate Limits & Prediction Cap](#rate-limits--prediction-cap)
10. [Security & Best Practices](#security--best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Architecture Notes](#architecture-notes)

---

## Overview

The SirBro chatbot widget can operate in **Partner Mode** when embedded on a third-party website (e.g. casino, betting platform, sports portal). Partner mode enables:

- **Co-branded header** — "SirBro AI × YourBrand" with your logo
- **Partner FAQ injection** — the AI answers questions specific to your platform
- **Affiliate casino cards** — rotating CTA cards after 3 predictions
- **Partner prediction cards** — "Bet" and "Download App" buttons on every prediction
- **Custom accent colour and widget size**
- **Partner-specific limit message** — localized in English, Spanish, Portuguese

Partner mode is **auto-detected** — no separate component is needed. Simply add `partner-id` to the standard `<sirbro-chat>` tag.

---

## Quick Start

### 1. Embed the Script

Add the widget script before the closing `</body>` tag of your page:

```html
<script src="https://chatbot-widget-alpha-two.vercel.app/sirbro-chat.js" defer></script>
```

### 2. Add the Widget Tag

```html
<sirbro-chat
  partner-id="YOUR_PARTNER_ID"
  partner-name="YourBrand"
  partner-logo="https://yourdomain.com/logo.png"
  faq-link="https://yourdomain.com/faq"
  affiliates='[
    {"casino":"YourBrand","url":"https://yourdomain.com/register","bonus":"100% up to €200"},
    {"casino":"Sister Casino","url":"https://sister.com/promo","bonus":"50 Free Spins"}
  ]'
  accent-color="#ff6b35"
></sirbro-chat>
```

> **Note:** `partner-id` must match a record in the `partner_configs` database table configured by the SirBro team. Contact your integration manager to register your partner ID.

---

## How Partner Mode Works

```
Partner website                 SirBro Backend              n8n AI Agent
      │                               │                           │
      │  POST /v1/chat/guest-message  │                           │
      │  { sessionId, message,        │                           │
      │    partnerId: "YOUR_ID" }     │                           │
      │──────────────────────────────>│                           │
      │                               │  findByPartnerId()        │
      │                               │──────────────────>        │
      │                               │  { faqDocumentUrl }       │
      │                               │<──────────────────        │
      │                               │                           │
      │                               │  POST /aiagent            │
      │                               │  { ..., partnerId,        │
      │                               │    faqDocumentUrl }       │
      │                               │──────────────────────────>│
      │                               │  AI response              │
      │                               │<──────────────────────────│
      │  ChatResponse                 │                           │
      │<──────────────────────────────│                           │
```

1. Widget auto-detects partner mode from `partner-id` attribute
2. Every API call includes `partnerId` in the request body
3. Backend looks up partner config in `partner_configs` table
4. `faqMarkdown` (from DB) and/or `faqLink` (from widget) are passed to the AI agent for context injection
5. AI answers questions about your platform using the available FAQ context
6. After 3 predictions the widget shows affiliate CTA cards (client-side)

---

## Widget Attributes Reference

### Required for Partner Mode

| Attribute      | Type   | Description                                                      |
|----------------|--------|------------------------------------------------------------------|
| `partner-id`   | string | Your unique partner identifier (must be registered by SirBro)    |
| `partner-name` | string | Your brand name displayed in the co-branded header               |

### Recommended

| Attribute          | Type   | Description                                                              |
|--------------------|--------|--------------------------------------------------------------------------|
| `partner-logo`     | string | Absolute URL to your logo image (PNG/SVG, ideally 40×40px or square)     |
| `affiliates`       | JSON   | Array of `AffiliateConfig` objects (see below)                           |
| `faq-link`         | string | URL to your live FAQ page (optional, passed directly to AI for context)   |
| `accent-color`     | string | CSS hex or rgb colour for buttons and accents (default `#6366f1`)        |

### Optional Styling

| Attribute       | Type   | Default  | Description                          |
|-----------------|--------|----------|--------------------------------------|
| `widget-width`  | number | `400`    | Widget width in pixels               |
| `widget-height` | number | `560`    | Widget height in pixels              |

### Standard Attributes (always available)

| Attribute       | Type   | Default                             | Description                     |
|-----------------|--------|-------------------------------------|---------------------------------|
| `api-url`       | string | `https://api.tipsterbro.com/v1`     | Backend API base URL            |
| `brand-icon`    | string | `''`                                | Chat bubble icon URL            |
| `show-markdown` | string | `'false'`                           | Enable markdown rendering       |

---

## Affiliate Links Configuration

The `affiliates` attribute accepts a **JSON array** of casino/partner links. This must be a valid JSON string embedded as an HTML attribute (use single quotes around the attribute, double quotes inside JSON).

### AffiliateConfig Shape

```typescript
interface AffiliateConfig {
  casino: string;  // Display name shown on the card
  url:    string;  // CTA link (should include tracking params)
  bonus:  string;  // Bonus text shown on the card
}
```

### Example

```html
affiliates='[
  {
    "casino": "LuckyCasino",
    "url": "https://luckycasino.com/promo?ref=sirbro",
    "bonus": "100% Welcome Bonus up to €500"
  },
  {
    "casino": "SpinPalace",
    "url": "https://spinpalace.com/go?aff=tipster",
    "bonus": "50 Free Spins — No Deposit Required"
  },
  {
    "casino": "BetKing",
    "url": "https://betking.com/affiliate/tipster",
    "bonus": "Bet €10, Get €30 Free Bet"
  }
]'
```

### Behaviour

- The widget cycles through affiliate entries each time the limit popup appears
- Each `AffiliateConfig.url` becomes the "Claim Bonus" link on the affiliate card
- Each `AffiliateConfig.url` is also used as the "Bet" button on prediction cards
- If `affiliates` is empty or missing, no affiliate cards are shown

> **Tracking:** Add your affiliate tracking parameters directly to each URL (UTM params, click IDs, etc.). The widget passes the URL unchanged.

---

## Style Customisation

### Via Widget Attributes

```html
<sirbro-chat
  accent-color="#e11d48"
  widget-width="420"
  widget-height="600"
  ...
></sirbro-chat>
```

### Via CSS Custom Properties

You can override any CSS variable on the `sirbro-chat` host element from your own stylesheet:

```css
sirbro-chat {
  --sirbro-accent:          #e11d48;
  --sirbro-bg:              rgba(10, 10, 20, 0.9);
  --sirbro-surface:         rgba(255, 255, 255, 0.07);
  --sirbro-text:            #f0f0f5;
  --sirbro-radius:          20px;
  --sirbro-width:           440px;
  --sirbro-height:          620px;
  --sirbro-font-size-base:  15px;
}
```

### Full CSS Variables Reference

| Variable               | Default                            | Description                         |
|------------------------|------------------------------------|-------------------------------------|
| `--sirbro-accent`      | `#6366f1`                          | Primary accent (buttons, highlights)|
| `--sirbro-accent-soft` | `rgba(99,102,241,0.15)`            | Soft accent background              |
| `--sirbro-bg`          | `rgba(10,10,20,0.85)`              | Widget background                   |
| `--sirbro-surface`     | `rgba(255,255,255,0.06)`           | Card/surface background             |
| `--sirbro-border`      | `rgba(255,255,255,0.08)`           | Border colour                       |
| `--sirbro-text`        | `#f0f0f5`                          | Primary text colour                 |
| `--sirbro-text-muted`  | `rgba(240,240,245,0.5)`            | Secondary/muted text                |
| `--sirbro-radius`      | `16px`                             | Widget border radius                |
| `--sirbro-font`        | `system-ui, ...`                   | Font family stack                   |
| `--sirbro-font-size-base` | `14px`                          | Base font size                      |
| `--sirbro-width`       | `400px`                            | Widget width                        |
| `--sirbro-height`      | `560px`                            | Widget height                       |
| `--sirbro-shadow`      | `0 8px 32px rgba(0,0,0,0.4), ...`  | Widget drop shadow                  |

---

## UI Behaviour in Partner Mode

### Header

The chat window header shows **"SirBro AI × YourBrand"** with both logos side by side. Your logo is rendered from the `partner-logo` URL.

### Welcome Screen

When the chat is first opened (no history), a partner-specific welcome screen is shown:

- Title: "SirBro AI × YourBrand"
- Subtitle: "Ask me anything about YourBrand or today's predictions"
- Suggestion chips tailored for partner context (e.g. "Today's top bets", "Best odds", "Casino bonuses")

### Prediction Cards

Every prediction card in partner mode includes two action buttons:

- **Bet** — links to the current affiliate URL (cycles through `affiliates` on each new prediction)
- **Download App** — deep links to iOS App Store or Google Play depending on the user's OS

The analysis text section is hidden in partner mode to keep cards focused on the CTA.

### Affiliate Card (after prediction limit)

When the 3-prediction daily limit is reached, the widget shows:

1. A localized limit message
2. An **Affiliate Card** cycling through your `affiliates` array, displaying:
   - Casino name
   - Bonus description
   - "Claim Bonus →" button
3. App store download buttons (if `ios-store-url` / `android-store-url` are set)
4. A "Next Casino" button to cycle to the next affiliate

---

## Rate Limits & Prediction Cap

| Limit               | Value                   | Applies to              |
|---------------------|-------------------------|-------------------------|
| Requests per minute | 6 per `sessionId`       | All guest sessions      |
| Daily predictions   | 3 per `sessionId`       | All guest sessions      |
| Total messages      | 20 per session (12 hrs) | All guest sessions      |

When the **daily prediction limit** is exceeded, the backend returns `HTTP 429` with:

```json
{
  "code": "guest_daily_prediction_limit_exceeded",
  "message": "You've used all 3 of today's free predictions. Check out our casino partners...",
  "stores": {
    "ios": "https://apps.apple.com/...",
    "android": "https://play.google.com/..."
  }
}
```

The widget displays this message together with your affiliate cards.

Limits are **per-session** (UUID stored in `localStorage`) and **in-memory on the backend** (reset on server restart). There is no per-IP limit.

---

## Security & Best Practices

### Affiliate URL Safety

- Always use HTTPS links
- Do not include API keys or auth tokens in affiliate URLs
- Use server-side redirect tracking where possible (e.g. `/go/casino-name`)

### partner-id

- The `partner-id` is **not a secret** — it is visible in page source
- It is used only for FAQ context injection and limit message customisation
- It does not grant any elevated access or bypass rate limits

### Content Security Policy

If your site uses a CSP header, you must allow:

```
connect-src https://api.tipsterbro.com;
script-src  https://chatbot-widget-alpha-two.vercel.app;
img-src     https://chatbot-widget-alpha-two.vercel.app <your-logo-host>;
frame-src   'none';
```

### CORS

No additional CORS configuration is required for partner integrations when using the widget script.

---

## Troubleshooting

### Widget opens but shows "SirBro AI" without co-branding

- Verify `partner-name` is set
- Verify `partner-logo` URL is reachable from the user's browser (CORS on image host)

### Affiliate CTAs not appearing after 3 predictions

- Verify `affiliates` is a valid JSON array (check browser console for parse errors)
- Confirm each entry has `casino`, `url`, and `bonus` keys

### AI doesn't answer questions about our platform

- Verify `partner-id` is registered by the SirBro team
- Verify `faq_document_url` is set and accessible by the backend (not behind auth)
- Check that the document is in plain text, HTML, or PDF format

### "Bet" button on prediction card links to wrong casino

- The "Bet" button cycles through the `affiliates` array in order, one per new prediction
- Verify your `affiliates` array has all intended entries

### CORS error in browser console

Contact the SirBro team to add your origin to the allowlist.

---

### Data Flow Summary

```
1. Widget renders with partner-id="casino-brand-123"
2. User types a message → widget POSTs { sessionId, message, locale, partnerId }
3. Backend looks up partner_configs WHERE partner_id = 'casino-brand-123' AND is_active = true
4. Backend sends to n8n: { ..., partnerId, faqDocumentUrl }
5. n8n retrieves FAQ doc → injects into AI system prompt
6. AI responds with prediction / answer (with partner context)
7. After 3 predictions → 429 response → widget shows affiliate CTA cycling
```
