# SirBro Chatbot Widget

Embeddable Lit Web Component distributed as a single IIFE bundle. The widget
uses Shadow DOM for style isolation and sends guest chat requests to the
TipsterBro backend.

## Development

```sh
npm install
npm run dev
npm run build
```

The build authority is `vite.config.ts`. Production output is
`dist/sirbro-chat.js`; `vercel.json` owns static deployment and CORS headers.
This repository currently has no lint or test command, so `npm run build` is
the available automated validation gate.

## Embed

```html
<script src="https://sirbro-chatbot.vercel.app/sirbro-chat.js" defer></script>
<sirbro-chat brand-icon="https://sirbro.com/assets/brandmark.png"></sirbro-chat>
```

The backend defaults to `https://api.tipsterbro.com/v1`. Override it only for a
controlled environment:

```html
<sirbro-chat api-url="https://api-dev.tipsterbro.com/v1"></sirbro-chat>
```

## Public attributes

Attributes are public API. Update this table and add browser evidence whenever
their behavior changes.

| Attribute       | Default        | Contract                                                                              |
| --------------- | -------------- | ------------------------------------------------------------------------------------- |
| `api-url`       | production API | Backend base URL; `/chat/guest-message` is appended.                                  |
| `brand-icon`    | empty          | Absolute URL for the launcher/header brand image.                                     |
| `show-markdown` | `false`        | Any value other than the string `false` enables Markdown rendering.                   |
| `partner-id`    | empty          | Enables partner mode and is sent with guest requests. It is not a secret.             |
| `partner-logo`  | empty          | Absolute URL for the co-branded header logo.                                          |
| `partner-name`  | empty          | Display name used by partner-mode UI.                                                 |
| `affiliates`    | empty          | JSON array of `{casino, url, bonus}` objects. Invalid JSON degrades to no affiliates. |
| `faq-link`      | empty          | Optional URL sent to the backend as partner context.                                  |
| `accent-color`  | theme default  | CSS color assigned to `--sirbro-accent`.                                              |
| `widget-width`  | `400`          | Width in pixels.                                                                      |
| `widget-height` | `560`          | Height in pixels.                                                                     |

## Partner embed

`partner-id` enables partner mode. The ID must be registered in the backend;
registration, rate limits, FAQ ingestion, and partner persistence remain
backend-owned contracts.

Partner registration and permission for the embedding origin are separate
prerequisites. Registering `partner-id` does not authorize arbitrary sites to
call guest chat. Before embedding, have the backend owner confirm that the
intended origin is accepted by the guest-chat middleware. Its current policy is
defined in the sibling backend's
[`widget-cors.middleware.ts`](https://github.com/M-Ivonin/tipsterBro-backend/blob/dev/src/middleware/widget-cors.middleware.ts);
there is no self-service origin-registration API described by this widget.
The external domains in the example below are placeholders, not an approved
origin or a working partner configuration.

Verify preflight and the actual message request from the real embedding page in
the target test environment. A `CORS preflight denied` or `CORS denied` response
belongs to that backend policy; changing widget attributes does not grant access.
The script's hosting origin and the browser page's request origin are different.

```html
<script src="https://sirbro-chatbot.vercel.app/sirbro-chat.js" defer></script>
<sirbro-chat
  partner-id="partner-123"
  partner-name="Partner"
  partner-logo="https://partner.example/logo.png"
  faq-link="https://partner.example/faq"
  affiliates='[{"casino":"Partner","url":"https://partner.example/join","bonus":"Welcome offer"}]'
  accent-color="#ff6b35"
  widget-width="420"
  widget-height="600"
></sirbro-chat>
```

Affiliate URLs are rendered as outbound CTAs. Use HTTPS, include tracking in
the URL itself, and never place secrets or authentication tokens in attributes.

## CSS customization

Host pages may override the stable design tokens exposed by
`src/styles/theme.ts`:

```css
sirbro-chat {
  --sirbro-accent: #ff6b35;
  --sirbro-bg: rgba(5, 5, 10, 0.9);
  --sirbro-font: Inter, sans-serif;
  --sirbro-font-size-base: 15px;
  --sirbro-width: 420px;
  --sirbro-height: 600px;
  --sirbro-radius: 20px;
}
```

## Host security policy

Embedding sites with Content Security Policy must allow the deployed script,
the configured API origin in `connect-src`, and any configured logo hosts in
`img-src`. The exact policy remains owned by the host site; do not weaken it by
adding broad wildcards solely for the widget.

## Ownership and retention

- `src/sirbro-chat.ts` is the authority for public attributes.
- `src/styles/theme.ts` is the authority for CSS variables and defaults.
- `src/services/api.ts` is the authority for the widget-side request/response
  projection.
- Backend behavior belongs in `tipsterBro-bakend` and must not be copied here.

Keep this README focused on embedding and stable public API. Do not add backend
implementation walkthroughs, current production counts, or duplicated source
file inventories.
